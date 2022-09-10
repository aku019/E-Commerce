import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
        phone:'+919831859604'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
        phone:'+919831859604'
    },
    {
        name: 'Jane Doe',
        email: 'Jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        phone:'+919831859604'
    },
]

export default users