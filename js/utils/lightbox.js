function showModal(modalElement){
   const modal = new window.bootstrap.Modal(modalElement) ;
   if(modal) modal.show();
}

export function registerLightBox({modalId ,imgSelector ,prevSelector ,nextSelector }){
  
    const modalElement = document.getElementById(modalId) ; 
   if(!modalElement) return ; 

   //check if this modal is registered or not
   if(Boolean(modalElement.dataset.register)) return ;

   // selectors
   const imageElement = modalElement.querySelector(imgSelector) ; 
   const prevButton = modalElement.querySelector(prevSelector) ;
   const nextButton = modalElement.querySelector(nextSelector) ;
   if(!imageElement || !prevButton || !nextButton) return ;
   
   let imgList = [] ;
   let currentIndex = 0 ;

   function showImageAtIndex(index){
    imageElement.src = imgList[index].src ;
   }
    // handle click for all imgs => event delegation
    // img click -> find all imgs with the same album
    // determine index of selected img
    // show modal with selected img

    document.addEventListener('click' , (event) => {
       const {target} = event ; 
       if(target.tagName !== 'IMG' || !target.dataset.album) return ; 

       imgList  = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`) ;
       currentIndex = [...imgList].findIndex((x) => x === target) ;
       
       showImageAtIndex(currentIndex) ;
       showModal(modalElement) ;
    //  console.log('album image album ' , {target ,currentIndex , imgList}) ;
    });
    // handle prev / next click
    prevButton.addEventListener('click' , () => {
        // show pre
        currentIndex = (currentIndex - 1 + imgList.length) % imgList.length ; 
        showImageAtIndex(currentIndex) ;
    }) ; 
    nextButton.addEventListener('click' , () => {
        // show next
        currentIndex = (currentIndex + 1) % imgList.length ; 
        showImageAtIndex(currentIndex) ;
    }) ; 
    // mark this modal 
    modalElement.dataset.register = true ; 
}