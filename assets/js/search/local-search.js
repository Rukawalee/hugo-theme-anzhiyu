window.addEventListener("load", () => {
  let loadFlag = false;
  let dataObj = [];
  const $searchMask = document.getElementById("search-mask");

  const openSearch = (prefill) => {
    const bodyStyle = document.body.style;
    bodyStyle.width = "100%";
    bodyStyle.overflow = "hidden";
    anzhiyu.animateIn($searchMask, "to_show 0.5s");
    anzhiyu.animateIn(document.querySelector("#local-search .search-dialog"), "titleScale 0.5s");
    setTimeout(() => {
      const input = document.querySelector("#local-search-input input");
      if (!input) return;
      if (typeof prefill === "string" && prefill) {
        input.value = prefill;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      input.focus();
    }, 100);
    if (!loadFlag) {
      search();
      loadFlag = true;
    }
    // shortcut: ESC
    document.addEventListener("keydown", function f(event) {
      if (event.code === "Escape" || event.keyCode === 27) {
        closeSearch();
        document.removeEventListener("keydown", f);
      }
    });
  };

  const closeSearch = () => {
    const bodyStyle = document.body.style;
    bodyStyle.width = "";
    bodyStyle.overflow = "";
    anzhiyu.animateOut(document.querySelector("#local-search .search-dialog"), "search_close .5s");
    anzhiyu.animateOut($searchMask, "to_hide 0.5s");
  };

  // shortcut: Shift+S (站内搜索) — Algolia path already has this; local-search was missing
  const isKeyboardOn = () => {
    const v = typeof anzhiyu_keyboard !== "undefined" ? anzhiyu_keyboard : localStorage.getItem("keyboardToggle");
    return v === true || v === "true" || v === 1 || v === "1";
  };
  const shiftSHandler = event => {
    // keyCode 83 = S; accept both upper/lower with shift
    const isS = event.keyCode === 83 || event.code === "KeyS" || event.key === "S" || event.key === "s";
    if (!isS || !event.shiftKey) return;
    if (!isKeyboardOn()) return;
    // don't steal typing in inputs/textareas/contenteditable
    const tag = (event.target && event.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || (event.target && event.target.isContentEditable)) return;
    event.preventDefault();
    const prefill = typeof selectTextNow === "string" ? selectTextNow : "";
    openSearch(prefill);
  };
  // register once (load handler runs once per full page; rebind on pjax complete below)
  window.addEventListener("keydown", shiftSHandler);

  window.openLocalSearch = openSearch;
  window.closeLocalSearch = closeSearch;

  const searchClickFn = () => {
    const btn = document.querySelector("#search-button > .search");
    if (btn) btn.addEventListener("click", openSearch);
    const menu = document.querySelector("#menu-search");
    if (menu) menu.addEventListener("click", openSearch);
  };

  const searchClickFnOnce = () => {
    document.querySelector("#local-search .search-close-button").addEventListener("click", closeSearch);
    $searchMask.addEventListener("click", closeSearch);
    if (GLOBAL_CONFIG.localSearch.preload) dataObj = fetchData(GLOBAL_CONFIG.localSearch.path);
  };

  // check url is json or not
  const isJson = url => {
    const reg = /\.json$/;
    return reg.test(url);
  };

  const fetchData = async path => {
    let data = [];
    // bust stale index.json (field shape changed during migration)
    const fetchUrl = path + (path.includes("?") ? "&" : "?") + "t=" + Date.now();
    const response = await fetch(fetchUrl);
    if (isJson(path)) {
      const raw = await response.json();
      // Hugo index.json uses url/permalink; Hexo searchdb uses url only.
      data = (Array.isArray(raw) ? raw : []).map(item => {
        const tags = item.tags || item.categories || [];
        return {
          title: item.title || "",
          content: item.content || "",
          url: item.url || item.permalink || "",
          tags: Array.isArray(tags) ? tags : [],
          oneImage: item.oneImage || item.cover || "",
        };
      });
    } else {
      const res = await response.text();
      const t = await new window.DOMParser().parseFromString(res, "text/xml");
      const a = await t;

      data = [...a.querySelectorAll("entry")].map(item => {
        let tagsArr = [];
        if (item.querySelector("tags") && item.querySelector("tags").getElementsByTagName("tag")) {
          Array.prototype.forEach.call(item.querySelector("tags").getElementsByTagName("tag"), function (item, index) {
            tagsArr.push(item.textContent);
          });
        }
        let content = item.querySelector("content") && item.querySelector("content").textContent;
        let imgReg = /<img.*?(?:>|\/>)/gi; //匹配图片中的img标签
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src
        let arr = content.match(imgReg); //筛选出所有的img

        let srcArr = [];
        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            let src = arr[i].match(srcReg);
            // 获取图片地址
            if (!src[1].indexOf("http")) srcArr.push(src[1]);
          }
        }

        return {
          title: item.querySelector("title").textContent,
          content: content,
          url: item.querySelector("url").textContent,
          tags: tagsArr,
          oneImage: srcArr && srcArr[0],
        };
      });
    }
    if (response.ok) {
      const $loadDataItem = document.getElementById("loading-database");
      $loadDataItem.nextElementSibling.style.display = "block";
      $loadDataItem.remove();
    }
    return data;
  };

  const search = () => {
    if (!GLOBAL_CONFIG.localSearch.preload) {
      dataObj = fetchData(GLOBAL_CONFIG.localSearch.path);
    }
    const $input = document.querySelector("#local-search-input input");
    const $resultContent = document.getElementById("local-search-results");
    const $loadingStatus = document.getElementById("loading-status");

    $input.addEventListener("input", function () {
      const keywords = this.value.trim().toLowerCase().split(/[\s]+/);
      if (keywords[0] !== "")
        $loadingStatus.innerHTML = '<i class="anzhiyufont anzhiyu-icon-spinner anzhiyu-pulse-icon"></i>';

      $resultContent.innerHTML = "";
      let str = '<div class="search-result-list">';
      if (keywords.length <= 0) return;
      let count = 0;
      // perform local searching
      dataObj.then(data => {
        data.forEach(data => {
          let isMatch = true;
          let dataTitle = data.title ? data.title.trim().toLowerCase() : "";
          let dataTags = Array.isArray(data.tags) ? data.tags : [];
          let oneImage = data.oneImage ?? data.cover ?? "";
          const dataContent = data.content
            ? data.content
                .trim()
                .replace(/<[^>]+>/g, "")
                .toLowerCase()
            : "";
          const rawUrl = data.url || data.permalink || "";
          if (!rawUrl) return;
          let dataUrl = rawUrl;
          if (!/^https?:\/\//i.test(dataUrl) && !dataUrl.startsWith("/")) {
            dataUrl = (GLOBAL_CONFIG.root || "/") + dataUrl;
          }
          let indexTitle = -1;
          let indexContent = -1;
          let firstOccur = -1;
          // only match articles with not empty titles and contents
          if (dataTitle !== "" || dataContent !== "") {
            keywords.forEach((keyword, i) => {
              indexTitle = dataTitle.indexOf(keyword);
              indexContent = dataContent.indexOf(keyword);
              if (indexTitle < 0 && indexContent < 0) {
                isMatch = false;
              } else {
                if (indexContent < 0) {
                  indexContent = 0;
                }
                if (i === 0) {
                  firstOccur = indexContent;
                }
              }
            });
          } else {
            isMatch = false;
          }

          // show search results
          if (isMatch) {
            if (firstOccur >= 0) {
              // cut out 130 characters
              // let start = firstOccur - 30 < 0 ? 0 : firstOccur - 30
              // let end = firstOccur + 50 > dataContent.length ? dataContent.length : firstOccur + 50
              let start = firstOccur - 30;
              let end = firstOccur + 100;
              let pre = "";
              let post = "";

              if (start < 0) {
                start = 0;
              }

              if (start === 0) {
                end = 100;
              } else {
                pre = "...";
              }

              if (end > dataContent.length) {
                end = dataContent.length;
              } else {
                post = "...";
              }

              let matchContent = dataContent.substring(start, end);

              // highlight all keywords
              keywords.forEach(keyword => {
                const regS = new RegExp(keyword, "gi");
                matchContent = matchContent.replace(regS, '<span class="search-keyword">' + keyword + "</span>");
                dataTitle = dataTitle.replace(regS, '<span class="search-keyword">' + keyword + "</span>");
              });

              str += '<div class="local-search__hit-item">';
              if (oneImage) {
                str += `<div class="search-left"><img src="${oneImage}" alt="" data-fancybox="gallery">`;
              } else {
                str += '<div class="search-left" style="width:0">';
              }

              str += "</div>";

              if (oneImage) {
                str +=
                  '<div class="search-right"><a href="' +
                  dataUrl +
                  '" class="search-result-title">' +
                  dataTitle +
                  "</a>";
              } else {
                str +=
                  '<div class="search-right" style="width: 100%"><a href="' +
                  dataUrl +
                  '" class="search-result-title">' +
                  dataTitle +
                  "</a>";
              }

              count += 1;

              if (dataContent !== "") {
                str +=
                  '<p class="search-result" onclick="pjax.loadUrl(`' +
                  dataUrl +
                  '`)">' +
                  pre +
                  matchContent +
                  post +
                  "</p>";
              }
              if (dataTags && dataTags.length) {
                str += '<div class="search-result-tags">';

                for (let i = 0; i < dataTags.length; i++) {
                  const element = dataTags[i].trim();

                  str +=
                    '<a class="tag-list" href="/tags/' +
                    element +
                    '/" data-pjax-state="" one-link-mark="yes">#' +
                    element +
                    "</a>";
                }

                str += "</div>";
              }
            }
            str += "</div></div>";
          }
        });
        if (count === 0) {
          str +=
            '<div id="local-search__hits-empty">' +
            GLOBAL_CONFIG.localSearch.languages.hits_empty.replace(/\$\{query}/, this.value.trim()) +
            "</div>";
        }
        str += "</div>";
        $resultContent.innerHTML = str;
        if (keywords[0] !== "") $loadingStatus.innerHTML = "";
        window.pjax && window.pjax.refresh($resultContent);
      });
    });
  };

  searchClickFn();
  searchClickFnOnce();

  // pjax
  window.addEventListener("pjax:complete", () => {
    !anzhiyu.isHidden($searchMask) && closeSearch();
    searchClickFn();
  });
});
