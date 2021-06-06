   /*
   + Количество показываемых слайдов — ulitochka-show-slides
   + отступы между слайдами — ulitochka-gap-slides
   + высота слайдов — ulitochka-height-slides
   + обернуть стрелки — ulitochka-arrow-wrapper="class"
   + адаптивность (сколько слайдов показывать на разных экранах) — ulitochka-adaptive="[ширина экрана, сколько показывать слайдов, высота слайдов],[800, 1, 300px]"
   + слайдер смещением или появленем — ulitochka-animation="shift|appear"
   + листается ли слайдер перетаскиванием на десктопе — ulitochka-drag="true|false"
   + автослайд — setInterval(ulitochkaSlide.bind(sliders[0]), 1000, "left", true);
   + открытие картинок в фул размере и слайдить их в таком виде — ulitochka-hirez="[классы левой стрелки], [классы правой стрелки], [классы кнопки закрытия], wrap", чтобы пропустить элемент указать "[]"
   - добавлять id/class слайдерам — это можно и так сделать
   + добавлять классы стрелкам — ulitochka-arrow-class="[left] [right]"
   + точки для перехода к слайдам — ulitochka-dots="dot|accumulate"
   */

//скрытие картинок пока стили не приенятся
document.addEventListener("DOMContentLoaded", function() {
    let sliders = document.querySelectorAll(".ulitochka");
    for (let s of sliders) {
        s.classList.add("dont-touch-me");
    }
})

window.addEventListener("load", ready);
function ready(){
  /*
  Получить список всех сладеров где задана адаптивность
  записать их адаптивы в массив
  обращаться к конкретному слайдеру при ресайзе по его порядковому номеру в массиве
  */
    let sliders = document.querySelectorAll(".ulitochka");
    if(sliders.length==0) return;
    let hirezOverlay = `<div id="ulitochka-hirez-overlay">
        <button class="ulitochka-close"></button>
        <div class="ulitochka">
            <span direction="left" class="ulitochka-arrow"></span>
            <span direction="right" class="ulitochka-arrow"></span>
            <div class="ulitochka-slide-wrapper"></div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("afterbegin", hirezOverlay);
    var overlay = document.querySelector("#ulitochka-hirez-overlay");
    var closeOverlay = overlay.querySelector(".ulitochka-close");
    let overlayArrows = overlay.querySelectorAll(".ulitochka-arrow");
    let overlaySlider = overlay.querySelector(".ulitochka");
    for(let a of overlayArrows){
      a.addEventListener("pointerup", ulitochkaSlide);
    }
    closeOverlay.onclick = ()=>{
        overlay.classList.remove("active");
    }
    overlaySlider.addEventListener("pointerdown", ulitochkaDragSlide);
    let autoSliders = [];
    let slidersarrows;
    let arrows = `<span direction="left" class="ulitochka-arrow"></span>
                <span direction="right" class="ulitochka-arrow"></span>`;
    //создаем верстку слайдеров
    for (let s of sliders) {
        let wrapper = document.createElement('div');
        wrapper.classList.add("ulitochka-slide-wrapper");
        wrapper.innerHTML = s.innerHTML;
        if(s.hasAttribute("ulitochka-arrow-wrapper")){
            s.innerHTML = `<div class="ulitochka-arrow-wrapper">${arrows}</div>`;
        }else{
            s.innerHTML = arrows;
        }
        slidersarrows = document.querySelectorAll(".ulitochka .ulitochka-arrow");
        s.appendChild(wrapper);
        s.setAttribute("ulitochka-active-slide", "0");
        //применяем стили, переданные в атрибутах
        let slides = s.querySelectorAll(".ulitochka-slide-wrapper>*");
        if(slides.length==0) continue;
        let animation = s.getAttribute("ulitochka-animation")==null ? "shift" : s.getAttribute("ulitochka-animation");
        let cnt = s.getAttribute("ulitochka-show-slides")==null||+s.getAttribute("ulitochka-show-slides")==NaN ? 1 : +s.getAttribute("ulitochka-show-slides");
        s.addEventListener("pointerdown", ulitochkaDragSlide);
        if(s.hasAttribute("ulitochka-gap-slides")){
            s.style.setProperty("--ulitochka-slide-gap", `${s.getAttribute("ulitochka-gap-slides")}`);
        }
        setSlideWidth(s);
        if(s.hasAttribute("ulitochka-height-slides")){
            s.style.setProperty("--ulitochka-slide-height", `${s.getAttribute("ulitochka-height-slides")}`);
            s.style.setProperty("--ulitochka-default-height", `${s.getAttribute("ulitochka-height-slides")}`);
        }
        if(animation=="shift"){
            s.classList.add("ulitochka-shift");
            for(let i=0;i<cnt;i++){
                slides[i].classList.add("active-slide");
            }
        }else if(animation=="appear"){
            s.classList.add("ulitochka-appear");
            for(let i=0;i<cnt;i++){
                slides[i].classList.add("active-slide");
            }
        }
        setArrClass(s);
        if(s.hasAttribute("ulitochka-dots")){
            s.insertAdjacentHTML("beforeEnd", "<div class='ulitochka-dots'></div>");
            let dotsBlock = s.querySelector(".ulitochka-dots");
            for(let i=0;i<slides.length;i++){
                dotsBlock.insertAdjacentHTML("beforeEnd", `<div class='dot' slide="${i}"></div>`);
            }
            let dots = s.querySelectorAll(".ulitochka-dots>*");
            for(let i=0;i<cntToShow(s)[0];i++){
                dots[i].classList.add("ulitochka-active-dot");
            }
            for(let d of dots){
                d.addEventListener("click", dotsSlide);
                d.addEventListener("touchend", dotsSlide);
            }
        }
        if(s.hasAttribute("ulitochka-hirez")){
            s.addEventListener("pointerdown", openHirez);
        }
        s.classList.remove("dont-touch-me");
    }

    //Обработчик кликов на стрелки
    for(let a of slidersarrows){
        a.addEventListener("pointerup", ulitochkaSlide);
    }

    window.addEventListener("resize", ()=>{
      for (let s of sliders){
        setSlideWidth(s);
        s.setAttribute("ulitochka-active-slide", "0");
        let showSlide = cntToShow(s);
        s.style.setProperty("--ulitochka-slide-height", showSlide[1])
        //console.log(showSlide);
        let slides = s.querySelectorAll(".ulitochka-slide-wrapper>*");
        let hasDots = s.hasAttribute("ulitochka-dots");
        let dots = s.querySelectorAll(".ulitochka-dots>*");
        for(let i=0;i<slides.length;i++){
          slides[i].classList.remove("active-slide");
          if(hasDots) dots[i].classList.remove("ulitochka-active-dot");
        }
        for(let i=0;i<showSlide[0];i++){
          slides[i].classList.add("active-slide");
          if(hasDots) dots[i].classList.add("ulitochka-active-dot");
        }
        s.querySelector(".ulitochka-slide-wrapper").style.transform = `translateX(0)`;
      }
      setSlideWidth(overlaySlider);
      overlaySlider.setAttribute("ulitochka-active-slide", "0");
      overlay.querySelector(".ulitochka-slide-wrapper").style.transform = `translateX(0)`;
    });
}

//Задать классы кнопкам
function setArrClass(elem){
  let classes = elem.getAttribute("ulitochka-arrow-class");
  if(classes!=null){
    classes = classes.match(/\[(([-\w+]+ *,? *)+)?\]/g);
    if(classes[0] != "[]"){
      let a = classes[0].match(/[\w-]+/g);
      elem.querySelector("[direction='left']").classList.add(...a);
    }
    if(classes[1] != "[]"){
      let a = classes[1].match(/[\w-]+/g);
      elem.querySelector("[direction='right']").classList.add(...a);
    }
  }
}

//слайдер по кнопкам
function ulitochkaSlide(){
    let direction = this.getAttribute("direction");
    let slider = this.closest(".ulitochka");
    let slides = slider.querySelectorAll(".ulitochka-slide-wrapper>*");
    if(slides.length==0) return;
    let activeSlide = +slider.getAttribute("ulitochka-active-slide");
    //определяем сколько слайдов показывать
    let cntShow = cntToShow(slider)[0];
    slides[activeSlide].classList.remove("active-slide");
    if(direction=="left"){
        activeSlide = activeSlide-1<0 ? slides.length-cntShow : activeSlide-1;
    }else{
        activeSlide = activeSlide+1>slides.length-cntShow ? 0 : activeSlide+1;
    }
    shiftSlide(activeSlide, slider);
}

//двигаем слайды
function shiftSlide(activeSlide, slider){
    activeSlide = activeSlide/1;
    slider.setAttribute("ulitochka-active-slide", activeSlide);
    let anim = slider.getAttribute("ulitochka-animation")==null||slider.getAttribute("ulitochka-animation").match(/(shift\b)|(appear\b)/)==null ? "shift" : slider.getAttribute("ulitochka-animation");
    let slidesWrapper = slider.querySelector(".ulitochka-slide-wrapper");
    let slides = slider.querySelectorAll(".ulitochka-slide-wrapper>*");
    let hasDots = slider.hasAttribute("ulitochka-dots");
    let dotType = slider.getAttribute("ulitochka-dots");
    let dots = slider.querySelectorAll(".ulitochka-dots>*");
    let slideWidth = +slider.style.cssText.match(/--ulitochka-slide-width:\d+\.?\d+/)[0].replace(/--ulitochka-slide-width:/g, "");
    let gap = +window.getComputedStyle(slides[activeSlide]).marginRight.match(/\d+/)[0];
    let cntShow = +cntToShow(slider)[0];
    gap == null ? 0 : gap;
    //удаляем class:active-slide
    for(let s=0; s<slides.length;s++){
        slides[s].classList.remove("active-slide");
    }
    slidesWrapper.style.transform = `translateX(${-activeSlide*(slideWidth+gap)}px)`;
    if(anim=="shift"){
        //console.log(cntShow)
        let lastShow = activeSlide+cntShow>slides.length ? cntShow : activeSlide+cntShow;
        let start =  activeSlide;
        for(let i=start;i<lastShow;i++){
            slides[i].classList.add("active-slide");
        }
    }else if(anim=="appear"){
        //console.log(activeSlide, activeSlide+cntShow);
        let start = activeSlide;
        for(let i=start;i<activeSlide+cntShow;i++){
            slides[i].classList.add("active-slide");
        }
    }
    //определяем и закрашиваем активные точки
    if(hasDots){
        let start = dotType=="accumulate" ? 0 : activeSlide;
        for(let d of dots){
            d.classList.remove("ulitochka-active-dot");
        }
        for(let i=start;i<activeSlide+cntShow;i++){
            dots[i].classList.add("ulitochka-active-dot");
        }
    }
}

//слайдер по точкам
function dotsSlide(){
    let activeSlide = this.getAttribute("slide");
    let slider = this.closest(".ulitochka");
    let slides = slider.querySelectorAll(".ulitochka-slide-wrapper>*");
    if(+activeSlide+cntToShow(slider)[0]>slides.length) return;
    shiftSlide(activeSlide, slider);
}

//Задаём ширину слайдов
function setSlideWidth(elem){
    /*
    получить адаптивы и дефолтное количество показываемых слайдов
    проверить ширину экрана и свериться с адаптивами
    установить количество показываемых слайдов в соотвествии с адаптивами
    */
    let wrapper = elem.querySelector(".ulitochka-slide-wrapper");
    let slides = elem.querySelectorAll(".ulitochka-slide-wrapper>*");
    if(slides.length==0) return;
    let gap = window.getComputedStyle(slides[0]).marginRight.match(/\d+/)==null ? 0 : +window.getComputedStyle(slides[0]).marginRight.match(/\d+/)[0];
    let cnt = cntToShow(elem)[0];

    //задаём ширину слайдов в зависимости от количества слайдов и отступов меж ними
    /*
    cnt*sw + (cnt-1)*gw = w
    cnt*sw + gw*cnt - gw = w
    sw = (w - gw*cnt + gw)/cnt
    */
    console.log(wrapper.offsetWidth, wrapper.clientWidth)
    elem.style.setProperty("--ulitochka-slide-width", `${(wrapper.offsetWidth - gap*cnt + gap)/cnt}px`);
}

//адаптив (возвращает сколько показывать сейчас слайдов и высоту слайда)
function cntToShow(elem){
    let a = elem.getAttribute("ulitochka-adaptive");//сколько показывать слайдов при каждой ширине
    let show = elem.getAttribute("ulitochka-show-slides")==null ? 1 : +elem.getAttribute("ulitochka-show-slides").match(/\d+/)[0];//сколько показывать по умолчанию
    let height = elem.style.getPropertyValue("--ulitochka-slide-height") == "" ? "auto" : elem.style.getPropertyValue("--ulitochka-default-height");//высота по умолчанию
    //если указаны адаптивы свериться с ними иначе дефолтное количество
    if(a!=null){
        let width = window.outerWidth;
        let adaptiv = a.match(/\[((\w+ *,? *)+)?\]/g);
        for(let i=0; i<adaptiv.length; i++){
          let arr = adaptiv[i].match(/\w+/g);
          let aw = +arr[0].match(/\d+/g);
          let ac = +arr[1].match(/\d+/g);
          let ah = arr[2]==undefined ? height : arr[2].match(/\w+/g)[0];
          adaptiv[i] = [aw, ac, ah];
        }
        adaptiv = adaptiv.sort(descendingSort);
        if(width<adaptiv[0][0]){
            //находим наименьшую подходящую ширину указанную в адаптиве
            for(let i=0;i<adaptiv.length;i++){
                if(adaptiv[i+1]!=undefined && width<adaptiv[i][0] && width>adaptiv[i+1][0]){
                    return [adaptiv[i][1], adaptiv[i][2]];
                }else if(adaptiv[i+1]==undefined){
                    return [adaptiv[i][1], adaptiv[i][2]];
                }
            }
        }
    }
    return [show, height];
}

//сортировка по убыванию массива с адаптивами
function descendingSort(a,b){
    if(a[0] === b[0]){
        return 0;
    }else{
        return (a[0] < b[0]) ? 1 : -1;
    }
}

/*
.mousedown == .touchstart
.mousemove == .touchmove
.mouseup  == .touchend
*/
//драг слайдер
function ulitochkaDragSlide(e){
    if(e.target.tagName=="A"){
        return;
    }
    e.preventDefault();
    if(e.target.classList.contains("ulitochka-arrow") || e.target.classList.contains("dot")){
        return;
    }
    let appear = false;
    if(this.getAttribute("ulitochka-animation")=="appear"){
        appear = true;
    }
    let slidesWrapper = this.classList.contains("ulitochka-slide-wrapper") ? this : this.querySelector(".ulitochka-slide-wrapper");
    let slider = this.closest(".ulitochka");
    let hasDots = slider.hasAttribute("ulitochka-dots");
    let dotType = slider.getAttribute("ulitochka-dots");
    let dots = slider.querySelectorAll(".ulitochka-dots>*");
    let hasdots = this.closest(".ulitochka[ulitochka-dots]")!=null;
    let cntShow = cntToShow(this)[0];
    let slides = this.querySelectorAll(".ulitochka-slide-wrapper>*");
    if(slides.length==0) return;
    let translate = window.getComputedStyle(slidesWrapper).transform=="none" ? 0 : +window.getComputedStyle(slidesWrapper).transform.match(/-?\d+/g)[4];
    let gap = +window.getComputedStyle(slides[0]).marginRight.match(/\d+/)[0];
    gap == null ? 0 : gap;
    let activeSlide = +slider.getAttribute("ulitochka-active-slide");
    let start = e.targetTouches==undefined ? e.clientX : e.targetTouches[0].clientX;
    let end = 0;
    function moveSlide(e){
        slidesWrapper.classList.add("ulitochka-no-transition");
        slidesWrapper.style.transform = e.targetTouches==undefined ? `translateX(${translate+(e.clientX-start)}px)` : `translateX(${translate+(e.targetTouches[0].clientX-start)}px)`;
    }
   this.addEventListener("pointermove", moveSlide);
   this.addEventListener("pointerup", up);
    function up(e){
        end = e.changedTouches==undefined ? e.clientX : e.changedTouches[0].clientX;
        slides[activeSlide].classList.remove("active-slide");
        if(Math.abs(start-end) > this.clientWidth*0.2){
            if(start>end){
                activeSlide = activeSlide+1>slides.length-cntShow ? 0 : activeSlide+1;
            }else{
                activeSlide = activeSlide-1<0 ? slides.length-cntShow : activeSlide-1;
            }
            if(hasdots){
                slider.querySelector(".dot.ulitochka-active-dot").classList.remove("ulitochka-active-dot");
                slider.querySelectorAll(".dot")[activeSlide].classList.add("ulitochka-active-dot");
            }
            translate = -activeSlide*(slides[0].clientWidth+gap);
            slidesWrapper.style.transform = `translateX(${translate}px)`;

                for(let s of slides){
                    s.classList.remove("active-slide");
                }
                for(let i=activeSlide;i<activeSlide+cntShow;i++){
                    slides[i].classList.add("active-slide");
                }

        }else{
            slidesWrapper.style.transform = `translateX(${translate}px)`;
        }
        slides[activeSlide].classList.add("active-slide");
       	this.removeEventListener("pointermove", moveSlide);
        slidesWrapper.classList.remove("ulitochka-no-transition");
       	this.removeEventListener("pointerup", up);
        slider.setAttribute("ulitochka-active-slide", activeSlide);
        //определяем и закрашиваем активные точки
        if(hasDots){
            let start = dotType=="accumulate" ? 0 : activeSlide;
            for(let d of dots){
                d.classList.remove("ulitochka-active-dot");
            }
            for(let i=start;i<activeSlide+cntShow;i++){
                dots[i].classList.add("ulitochka-active-dot");
            }
        }
    }
}

function openHirez(e) {
    if(e.target.tagName=="A" || e.target.classList.contains("ulitochka-arrow") || e.target.classList.contains("dot") || e.button>0 ) return;
    var overlay = document.querySelector("#ulitochka-hirez-overlay");
    let u = overlay.querySelector(".ulitochka");
    var contentOverlay = overlay.querySelector(".ulitochka-slide-wrapper");
    let start = e.changedTouches==undefined ? e.clientX : e.changedTouches[0].clientX;
    let end = 0;
    this.addEventListener("pointerup", up);
    function up(e){
        end = e.changedTouches==undefined ? e.clientX : e.changedTouches[0].clientX;
        if(start==end){
            contentOverlay.innerHTML = this.querySelector(".ulitochka-slide-wrapper").innerHTML;
            setSlideWidth(u);
            let indexSlide = [...this.querySelectorAll(".ulitochka-slide-wrapper>*")].indexOf(e.target);
            shiftSlide(indexSlide, u);
            let btnClasses = this.getAttribute("ulitochka-hirez").match(/\[(([-\w+]+ *,? *)+)?\]/g);
            if(btnClasses!=null){
              if(btnClasses[0]!="[]") overlay.querySelector(".ulitochka-arrow[direction='left']").classList.add(...btnClasses[0].match(/[\w-]+/g));
              if(btnClasses[1]!="[]") overlay.querySelector(".ulitochka-arrow[direction='right']").classList.add(...btnClasses[1].match(/[\w-]+/g));
              if(btnClasses[2]!="[]") overlay.querySelector(".ulitochka-close").classList.add(...btnClasses[2].match(/[\w-]+/g));
            }
            overlay.classList.add("active");
        }
        this.removeEventListener("pointerup", up);
        setSlideWidth(overlay.querySelector(".ulitochka"));
    }
}
