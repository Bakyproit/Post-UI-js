

//pagination
export function renderPagination(elementId ,pagination){
    const ulPagination = document.getElementById(elementId) ;

    if(!pagination || !ulPagination) return ;

    // calc totalPages
    const {_page , _limit , _totalRows} = pagination ;
    const totalPages = Math.ceil(_totalRows / _limit) ;
    // save page and totalPages
    ulPagination.dataset.page = _page ;
    ulPagination.dataset.totalPages = totalPages ;
    // check if enable/disable 
    if(_page <= 1) ulPagination.firstElementChild?.classList.add('disabled') ;
    else {
        ulPagination.firstElementChild?.classList.remove('disabled') ;
    } 
    if(_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled') ;
    else ulPagination.lastElementChild?.classList.remove('disabled') ;
}

export function initPagination({elementId , defaultParams , onchange}){
   //bind click event
   const ulPagination = document.getElementById(elementId) ;
   if(!ulPagination) return ;
   //add click event prev link
   const prevLink = ulPagination.firstElementChild?.firstElementChild ;
   if(prevLink){
    prevLink.addEventListener('click' ,(e) =>{
        e.preventDefault() ;
    
        const page = ulPagination.dataset.page ;
        const totalPages = ulPagination.dataset.totalPages ;
        if(page > 2) onchange?.(page - 1) ;
    }) ;
   }
   // add click event next link
   const nextLink = ulPagination.lastElementChild?.lastElementChild ;
   if(nextLink) {
    nextLink.addEventListener('click' , (e)=>{
        e.preventDefault() ;

        const page = Number.parseInt(ulPagination.dataset.page) || 1 ;
        const totalPages = ulPagination.dataset.totalPages ;
        if(page < totalPages) onchange?.(page + 1) ;
    }) ;
   }
}