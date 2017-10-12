
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
            <textarea class='response'>${data.token}</textarea>
            <p class='admin-response'>Admin Access: ${data.adminVerification}</p>
          `)
          verificationColor(data.adminVerification)
        })
      .catch(err => {
        tokenDiv.append(`Unexpected error`, err)
      })
    }
  })

  const verificationColor = (data) => {
    if(!data) {
      $('.admin-response').addClass('red');
      $('.main-container').addClass('red-shadow');
    } else {
      $('.main-container').addClass('green-shadow');
    }
  }


btnFillData.on('click', fillData);
