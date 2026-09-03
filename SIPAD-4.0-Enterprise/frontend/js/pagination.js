function paginate(arr,page=1,size=10){const s=(page-1)*size;return arr.slice(s,s+size)}
