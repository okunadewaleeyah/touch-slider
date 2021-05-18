// bring in the slider
// add a comma after getting the slider-container to also get the slides

const slider = document.querySelector('.slider-container'),
slides = Array.from(document.querySelectorAll('.slide')) 
// array.from takes an array-like object like a DOM list 
// and turns it into an array. creates an array from an iterable object


// setting global variables
let isDragging = false, // reps if i have my finger/mouse on the obj in the browser
    startPosition = 0, // wherever i click/put my finger on
    currentTranslate = 0, // reps the value i want for transform: translateX(0); in CSS
    prevTranslate = 0,
    animationID = 0, // request animation frame. oh joy! a mthd on wndw obj that
                    // returns specific id that can be used to cancel the request frame
    currentIndex = 0 // reps the current slide

// looping through the slides
slides.forEach((slide, index) => {
    // get rid of the default click and drag img effect
    const slideImage = slide.querySelector('img')
    slideImage.addEventListener('dragstart', (e) => e.preventDefault())
    // add touch events
    // paarameter index. whichever slide i'm on is going to get passed in 
    //as the index
    slide.addEventListener('touchstart', touchStart(index))
    slide.addEventListener('touchend', touchEnd) // when i take my finger off the device
    slide.addEventListener('touchmove', touchMove) // moving around

    // add mouse events
    slide.addEventListener('mousedown', touchStart(index))
    slide.addEventListener('mouseup', touchEnd) // when i let go of the mouse button
    slide.addEventListener('mouseleave', touchEnd) // when i go offscreen with d mouse
    slide.addEventListener('mousemove', touchMove)
})    

// disable menu
window.oncontextmenu = function(event) {
    event.preventDefault()
    event.stopPropagation() // prevent  any propagation to any oarent element
    return false
}

function touchStart(index) { // since touchStart(index) was called earlier,
                            //return a function
    return function(event) {
        // console.log('start');
        currentIndex = index
        startPosition = getPositionX(event)
        // console.log(startPosition);
        isDragging = true

        // request animation frame tells the browser that we want to perform an
        // animation and request a call to a specific fucntion to update that animation
        // before the nest replay
        // ****** note to self:- check css-tricks.com/using-requestanimationframe/*************************************************************/
        animationID = requestAnimationFrame(animation)
        slider.classList.add('grabbing')
    }
}

function touchEnd() { 
    //console.log('end');
    isDragging = false
    // end request frame 
    cancelAnimationFrame(animationID)

    // when image is moved a certain distance horizontally
    // i want the next image to swivel in
    const movedBy = currentTranslate - prevTranslate
    // check to see if i move it each way a certain amount
    // -100 because i want the images to move to the left of the screen (translateX)
    // +100 gets the images to move to the right
    if(movedBy <  -100 && currentIndex < slides.length - 1) 
    currentIndex += 1

    if(movedBy >  +100 && currentIndex > 0) 
    currentIndex -= 1

    setPositionByIndex()
    

    slider.classList.remove('grabbing')
}

function touchMove(event) { 
    if (isDragging) {
        // console.log('move');
        const currentPosition = getPositionX(event) // getPositionX to figure out where the mouse is clicking 
                                                    // or where the finger is finger is touching
        currentTranslate = prevTranslate + currentPosition - startPosition
    }
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

function animation() {
    setSliderPsition()
    // i only want to animate if isDragging is true 
    if (isDragging) requestAnimationFrame(animation)
}

function setSliderPsition() {
    slider.style.transform = `translateX(${currentTranslate}px)`
}

function setPositionByIndex () {
    currentTranslate = currentIndex * -window.innerWidth
    prevTranslate = currentTranslate
    setSliderPsition()
}