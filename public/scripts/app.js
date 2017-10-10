
let btnFillData = $('#btn-fill-data');


const fillData = () => {
  
  
// console.log('key:', apiKey);


  fetch(`http://api.brewerydb.com/v2/breweries?key=${breweryDBKey}`)
    .then(data => {
      console.log('your data is:', data)
    })



}



btnFillData.on('click', fillData);