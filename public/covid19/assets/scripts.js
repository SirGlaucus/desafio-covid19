const botonPruebaSelector = document.querySelector('#prueba')
const tablaDatos = document.querySelector('#bodyTabla')


botonPruebaSelector.addEventListener('click', async () => {
    const email = 'Sincere@april.biz'
    const password = 'secret'
    const jwt = await postData(email, password)
    console.log(jwt)
    getDatosTotales(jwt)
})

const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })

        const { token } = await response.json()
        localStorage.setItem('jwt-token', token)
        return token
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

const getDatosTotales = async (jwt) => {
    try {
        const response = await fetch(`http://localhost:3000/api/total`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        const datosFiltrados = data.filter(datosPaises => {
            return datosPaises.active >= 10000
        })
        console.log(datosFiltrados)
    } catch (error) {
        console.log(error)
    }
}

const getPaises = async (jwt) => {
    try {
        const response = await fetch(`http://localhost:3000/api/total`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            })
        const { data } = await response.json()
        if (data) {
           
            let rows = "";
            $.each(data, (i, row) => {
                
                rows += `<tr>
                            <td> ${row.location} </td>
                            <td> ${row.confirmed} </td>
                            <td> ${row.deaths} </td>
                            <td> ${row.recovered} </td>
                            <td> ${row.active} </td>
                        </tr>`
            })
          tablaDatos.innerHTML = rows
        }
    } catch (error) {
        console.log(error)
    }
}
getPaises(localStorage.getItem('jwt-token'))