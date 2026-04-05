export const adminApprovedTemplate=(username)=>{
    return  `<h2>Hi ${username},</h2>
    <p>Your admin request has been <b style="color:green;">approved</b>.</p>`;
}

export const adminRejectedTemplate=(username)=>{
    return  `<h2>Hi ${username},</h2>
    <p>Your admin request has been <b style="color:red;">rejected</b>.</p>`;
}

