
let btnFillData = $('#btn-fill-data');


const fillData = () => {
  fetch(`http://api.brewerydb.com/v2/breweries?key=${breweryDBKey}`)
    .then(data => {
      console.log('your data is:', data)
    })
  }

  $('.auth-submit').on('click', () => {
    let appName = $('.appName-input').val();
    let email = $('.email-input').val();
    let tokenDiv = $('.token-container')
    tokenDiv.empty()
    if(!appName || !email) {
      tokenDiv.append(`Invalid request.  Please enter Appname and Email`)
    } else {
      fetch('http://localhost:3000/api/v1/authenticate', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({appName: appName, email: email
        })
      })
      .then(data => data.json())
      .then(data => {
          tokenDiv.append(`
            <p>${data.token}</p><br>
            <p>${data.adminVerification}</p>
          `)
        })
      .catch(err => {
        tokenDiv.append(`Unexpected error`, err)
      })
    }
  })


btnFillData.on('click', fillData);
