const otpmailtemp = ({name, otp})=>{
    return  `<div>
        <h1>Dear ${name}</h1>
        <p>You have requested a password reset, The otp for the reset is as follows</p>
        <div style="background: red;font-size:20px"> <p>${otp}</p> </div>
        <p>This otp is valid only for 30mins and please don't share this with anyone. Proceed to enter this to login to your account</p>
        <br></br>

        <p>Thank you, Vroom</p>
    </div>`
}

export default otpmailtemp