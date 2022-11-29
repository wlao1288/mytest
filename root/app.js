const apps={tripcard:{title:"通信大数据行程卡",icon:"tripcard/static/img_arrow@2x.png",link:"tripcard/index.html",color:"#2ba667",help_text:"<p>点击手机号或途经地点可以修改相关信息。</p>",menu:[]},tfjkt:{title:"四川天府健康通",icon:"tfjkt/static/message-icon.png",link:"tfjkt/index.html",color:"#0ba099",help_text:"<p>点击姓名、证件号、场所地址等可以修改对应信息；</p><p>点击“扫场所码”展示场所码。</p>",menu:[{title:"场所",icon:"place",link:"tfjkt/checkin.html"}]}};function onIconFail(t){t.closest(".app").classList.add("inactivated")}function render(){let html="";for(var[name,app]of Object.entries(apps)){let menu_html="";if(app.menu)for(const menu_item of app.menu)menu_html+=`
          <div class="app-menu-item" data-role="link" data-link="${menu_item.link||""}">
            <img class="app-menu-app-icon" src="common/icons/${menu_item.icon||"qr_code"}.svg"></img>
            <span class="app-menu-app-title">${menu_item.title}</span>
          </div>
        `;menu_html+=`
    <div class="app-menu-item ${localStorage.getItem("pinned")&&0<=localStorage.getItem("pinned").split(",").indexOf(name)?"active":""}" data-role="pin">
      <img class="app-menu-app-icon" src="common/icons/push_pin.svg"></img>
    </div>`,app.help_text&&(menu_html+=`
        <div class="app-menu-item" data-role="help">
          <img class="app-menu-app-icon" src="common/icons/info.svg"></img>
        </div>
      `);let credits_html="";if(app.contributors)for(const contributor of app.contributors)"namestrip"==contributor.style?credits_html+=`
            <div class="app-contributor app-contributor-namestrip">
              <span class="contributor-nametag">${contributor.name}</span>
              <span class="contributor-description">${contributor.description}</span>
            </div>
          `:"text"==contributor.style&&(credits_html+=`
            <div class="app-contributor">
              <span class="contributor-nametag">${contributor.name}</span>
              <span class="contributor-description">${contributor.description}</span>
            </div>
          `);html+=`
    <div class="app" data-link="${app.link||""}" data-role="app" data-app-name="${name}">
      <div class="app-content">
        <img src="${app.icon}" onerror="onIconFail(this);" style="border-color: ${app.color||"#aaa"};">
        <div class="app-description">
          <div class="app-title-wrapper">
            <span class="app-title">${app.title}</span>
            <img class="app-title-icon" src="common/icons/arrow_forward.svg"></img>
          </div>
          <div class="app-menu">
            ${menu_html}
          </div>
        </div>
      </div>
      <div class="app-help">
        <div class="app-help-subtitle">使用说明</div>
        ${app.help_text}
        ${credits_html?`
          <div class="app-help-subtitle">致谢</div> 
          <div class="app-contributors-container">
            ${credits_html} 
          </div>
        `:""}
      </div>
    </div>`}document.querySelector(".apps-list").innerHTML=html;var elements=[...document.querySelectorAll(".app:not(.inactivated)"),...document.getElementsByClassName("app-menu-item")];if(elements.length)for(const element of elements){const data_link=element.attributes["data-link"]&&element.attributes["data-link"].value;var data_role=element.attributes["data-role"]&&element.attributes["data-role"].value;const parent_app=element.closest(".app");if(data_link)element.addEventListener("click",e=>{e.stopPropagation(),element.classList.contains("inactivated")||(window.location.href=data_link)});else if("help"==data_role)element.addEventListener("click",e=>{e.stopPropagation(),element.classList.contains("active")?(element.classList.remove("active"),parent_app.querySelector(".app-help").style.display="none"):(document.querySelectorAll(".app-help").forEach(element=>{element.classList.remove("active")}),element.classList.add("active"),parent_app.querySelector(".app-help").style.display="block")});else if("pin"==data_role){const item_id=parent_app.attributes["data-app-name"]&&parent_app.attributes["data-app-name"].value;item_id&&element.addEventListener("click",e=>{e.stopPropagation();let list=localStorage.getItem("pinned")?localStorage.getItem("pinned").split(","):[];if(element.classList.contains("active"))element.classList.remove("active"),parent_app.style.order=0,(list=list.filter(x=>x!=item_id)).length?localStorage.setItem("pinned",list.join(",")):localStorage.removeItem("pinned");else{element.classList.add("active"),parent_app.style.order=-1,list.push(item_id),localStorage.setItem("pinned",list.join(","));try{var app_name=parent_app.attributes["data-app-name"].value;navigator.serviceWorker.controller.postMessage({type:"download",content:app_name})}catch(e){}}})}}var pinned_list=localStorage.getItem("pinned")?localStorage.getItem("pinned").split(","):[];if(pinned_list)for(const element of document.querySelectorAll(".app:not(.inactivated)")||[])pinned_list.includes(element.attributes["data-app-name"].value)&&(element.style.order=-1),element.addEventListener("touchstart",e=>{e.target.classList&&e.target.classList[0].startsWith("app-menu-item")||element.classList.add("selected")}),element.addEventListener("touchmove",()=>{element.classList.remove("selected")}),element.addEventListener("touchend",()=>{element.classList.remove("selected")}),element.addEventListener("touchcancel",()=>{element.classList.remove("selected")});for(const element of document.querySelectorAll(".app-menu-item[data-role=link]")||[])element.addEventListener("touchstart",()=>{element.classList.add("active")}),element.addEventListener("touchmove",()=>{element.classList.remove("active")}),element.addEventListener("touchend",()=>{element.classList.remove("active")}),element.addEventListener("touchcancel",()=>{element.classList.remove("active")});for(const element of document.querySelectorAll(".app-help")||[])element.addEventListener("click",e=>{e.stopPropagation()});if(window.updateServiceWorker=()=>{},"serviceWorker"in navigator){navigator.serviceWorker.register("./service-worker.js",{scope:"./"}).then(e=>{window.updateServiceWorker=t=>{t&&(t.innerText="正在检查更新..."),e.addEventListener("updatefound",()=>{window.location.reload()}),e.update().then(reg=>{reg.installing?t&&(t.innerText="正在应用更新..."):t&&(t.innerText="未发现更新")}).catch(()=>{t&&(t.innerText="检查更新失败")})};let c=window.setInterval(()=>{navigator.serviceWorker.controller&&(window.clearInterval(c),navigator.serviceWorker.controller.postMessage({type:"download",content:["root","common","tripcard"].concat(localStorage.getItem("pinned")?localStorage.getItem("pinned").split(","):[]).filter((v,i,a)=>a.indexOf(v)==i)}),window.setInterval(()=>{navigator.serviceWorker.controller.postMessage({type:"check"})},4e3))},300)}).catch(e=>{});const setCached=item=>{item&&(item=document.querySelector(`.app[data-app-name=${item}]`))&&(item.querySelector(".app-title-icon").attributes.src.value="common/icons/download_done.svg")};navigator.serviceWorker.addEventListener("message",e=>{if(e.data&&"progress"!=e.data.type)if("complete"==e.data.type){document.getElementById("sw-help-text").style.display="flex";var cached_apps=e.data.content.cached;if("string"==typeof cached_apps)setCached(cached_apps);else for(const item of cached_apps)setCached(item);e.data.content.version&&(document.getElementById("last-update-version").innerText=`(${e.data.content.version})`)}else"reload"==e.data.type&&window.location.reload()})}document.getElementById("clear-local-data").addEventListener("click",()=>{navigator.serviceWorker&&navigator.serviceWorker.controller?window.confirm("要清除全部填充信息与页面缓存吗？")&&clearCache():window.confirm("要清除全部填充信息吗？")&&clearCache()}),navigator.standalone||window.matchMedia("(display-mode: standalone)").matches?document.querySelector(".sw-status").innerHTML=`
      <div class="icon-align" onclick="toggleDisplay('#pwa-usage-help');">
        <img class="icon" src="common/icons/help.svg">
        <span>帮助</span>
      </div>`:document.querySelector(".sw-status").innerHTML=`
      <div class="icon-align" onclick="toggleDisplay('#pwa-install-help');">
        <img class="icon" src="common/icons/add_box.svg">
        <span>添加至主屏幕</span>
      </div>`}function toggleDisplay(selector,flex=!1){selector=document.querySelector(selector);if(!selector)return!1;selector.style.display&&"none"!=selector.style.display?selector.style.display="none":selector.style.display=flex?"flex":"block"}function clearCache(){localStorage.clear(),navigator.serviceWorker&&navigator.serviceWorker.controller?(document.querySelector(".apps-list").innerHTML=`
      <p style="text-align: center">请稍候...</p>
    `,navigator.serviceWorker.controller.postMessage({type:"clear"})):window.location.reload()}