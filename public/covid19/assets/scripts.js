const botonPruebaSelector = document.querySelector('#prueba')

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