const verifytemp = ({name, url})=>{  //to embed html in js, use `` and ${} to embed variables
    return `
    <p>Dear, ${name}</p>
    <p>Thank you for registering with Vroom</p>
    <a href=${url} style="color:black;background:pink;margin-top:10px; padding : 20px"> verify email</a>
    `
}

export default verifytemp