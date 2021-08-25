const asyncHandler = require('express-async-handler')
const otpGenerator = require('otp-generator')
const User = require('../models/User')
const sendEmail = require('../../utils/sendEmail')
const generateToken = require('../../utils/generateToken')

exports.registeUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  let user = await User.findOne({ email })

  if (user) {
    res.status(400)
    throw new Error('User already exists. Please try with another one')
  } else {
    const otp = otpGenerator.generate(6, {
      upperCase: true,
      specialChars: false,
      alphabets: false,
    })

    user = await User.create({ name, email, password, otp })

    await sendEmail({
      email,
      subject: 'User Registration on Job Finder',
      text: `Your OTP is ${otp}`,
    })

    res.status(201).json({
      success: true,
      message: 'We already send an email. Please check your email',
    })
  }
})

exports.sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body

  let user = await User.findOne({ email })

  if (!user) {
    res.status(400)
    throw new Error('User not found on Job Finder')
  } else {
    const otp = otpGenerator.generate(6, {
      upperCase: true,
      specialChars: false,
      alphabets: false,
    })

    user.otp = otp

    await user.save()

    await sendEmail({
      email,
      subject: 'User Registration on Job Finder',
      text: `Your OTP is ${otp}`,
    })

    res.status(200).json({
      success: true,
      message: 'We already send an email. Please check your email',
    })
  }
})

exports.verifyUser = asyncHandler(async (req, res) => {
  const { email, otp, notifToken } = req.body

  let user = await User.findOne({ email })

  if (!user) {
    res.status(400)
    throw new Error('User not found on Job Finder')
  } else {
    if (user.otp !== otp) {
      res.status(400)
      throw new Error('The OTP entered is incorrect')
    } else {
      user.isValidated = true
      user.notifToken = notifToken

      await user.save()

      sendEmail({
        email,
        subject: 'Registration Success',
        text: 'Congratulations, your registration on Job Finder is successful',
      })

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isValidated: user.isValidated,
        birthdate: user.birthdate,
        photo: user.photo,
        notifToken: user.notifToken,
      })
    }
  }
})

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password, notifToken } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    if (!user.isValidated) {
      const otp = otpGenerator.generate(6, {
        upperCase: true,
        specialChars: false,
        alphabets: false,
      })

      user.otp = otp

      await user.save()

      await sendEmail({
        email,
        subject: 'User Registration on Job Finder',
        text: `Your OTP is ${otp}`,
      })
    } else {
      user.notifToken = notifToken

      await user.save()
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isValidated: user.isValidated,
      birthdate: user.birthdate,
      photo: user.photo,
      notifToken: user.notifToken,
    })
  } else {
    res.status(401)
    throw new Error('User not found on Job Hunter')
  }
})

exports.updateName = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  user.name = req.body.name

  await user.save()

  res.json({
    success: true,
    message: 'Your name has been changed successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isValidated: user.isValidated,
      birthdate: user.birthdate,
      photo: user.photo,
      notifToken: user.notifToken,
    },
  })
})

exports.updateBirthdate = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  user.birthdate = req.body.birthdate

  await user.save()

  res.json({
    success: true,
    message: 'Your birthdate has been changed successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isValidated: user.isValidated,
      birthdate: user.birthdate,
      photo: user.photo,
      notifToken: user.notifToken,
    },
  })
})

exports.updateEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user.email === req.body.email) {
    res.status(400)
    throw new Error('Your new email can not be the same as the old')
  } else {
    user.email = req.body.email

    await user.save()

    res.json({
      success: true,
      message: 'Your email has been changed successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isValidated: user.isValidated,
        birthdate: user.birthdate,
        photo: user.photo,
        notifToken: user.notifToken,
      },
    })
  }
})

exports.updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user._id)

  if (await user.matchPassword(newPassword)) {
    res.status(400)
    throw new Error('Your new password can not be the same as the old')
  } else if ((await user.matchPassword(oldPassword)) === false) {
    res.status(400)
    throw new Error('Your old password is incorrect')
  } else {
    user.password = newPassword

    await user.save()

    res.json({
      success: true,
      message: 'Your password has been changed successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isValidated: user.isValidated,
        birthdate: user.birthdate,
        photo: user.photo,
        notifToken: user.notifToken,
      },
    })
  }
})

exports.updatePhoto = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  user.photo = req.body.photo

  await user.save()

  res.json({
    success: true,
    message: 'Your photo has been changed successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      isValidated: user.isValidated,
      birthdate: user.birthdate,
      photo: user.photo,
      notifToken: user.notifToken,
    },
  })
})

exports.removeNotifToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  user.notifToken = ''

  await user.save()

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
    isValidated: user.isValidated,
    birthdate: user.birthdate,
    photo: user.photo,
    notifToken: user.notifToken,
  })
})
