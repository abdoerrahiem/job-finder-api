const mongoose = require('mongoose')

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    console.log('Database connected')
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = db
