module.exports = async function(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

/*
ini utk bagian di products model dan controlller karena masukan 
data sbanyak 3x dgn async nunggu pewaktuan masing2 dari image1,2, dan 3 ( tergantung indexnya )


*/