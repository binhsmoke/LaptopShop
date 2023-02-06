var otpModel = require('./model')

exports.getByEmail = async (email) => {
    return await otpModel.findOne({ email })
}

exports.delete = async (_id) => {
    await otpModel.deleteOne({ _id })
}

exports.insert = async (data) => {
    return await otpModel.create(data)
}

exports.update = async (email, code_otp) => {
    await otpModel.updateOne(
        { email },
        {
            $set:
            {
                code_otp
            }
        }
    )
}
