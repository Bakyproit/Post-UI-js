import debounce from "lodash.debounce";

//search
export function initSearch({elementId , defaultParams , onchange}){
    const searchInput = document.getElementById(elementId) ;
    if(!searchInput) return ;

    // title_like
    // const queryParams = new URLSearchParams(window.location.search) ;
    if(defaultParams &&  defaultParams.get('title_like')){
        searchInput.value = defaultParams.get('title_like') ;
    }
    const debounceSearch = debounce((event) => onchange?.(event.target.value)
    ,500) ;
    searchInput.addEventListener('input' , debounceSearch) ;
}
