var express = require('express')
var app = express()
var date = (new Date()).getFullYear(); 
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM students ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('user/list', {
                    title: 'User List',
                    date:  date,
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('user/list', {
                    title: 'User List',
                    date:  date, 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('user/add', {
        title: 'Add New Record',
        date:  date,
        firstname: '',
        lastname: '',
        middlename: '',
        dob: '',
        age: '',
        email: '',
        phone: '',
        matric: '',
        course: '',
        department: '',
        level: '',
        address: '',
        parentname: '',
        parentphone: '',
        nextofkin: ''        
    })
})
 
// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){    
    req.assert('firstname', 'First Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Last Name is required').notEmpty()
    req.assert('middlename', 'Middle Name is required').notEmpty()
    req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        var newrecord = {
            firstname: req.sanitize('firstname').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            middlename: req.sanitize('middlename').escape().trim(),
            dob: req.body.dob,
            age: req.sanitize('age').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            matric: req.body.matric,
            course: req.sanitize('course').escape().trim(),
            department: req.sanitize('department').escape().trim(),
            level: req.sanitize('level').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            parentname: req.sanitize('parentname').escape().trim(),
            parentphone: req.sanitize('parentphone').escape().trim(),
            nextofkin: req.sanitize('nextofkin').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO students SET ?', newrecord, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New Record',
                        date:  date,
                        firstname: newrecord.firstname,
                        lastname: newrecord.lastname,
                        middlename: newrecord.middlename,
                        dob: newrecord.dob,
                        age: newrecord.age,
                        email: newrecord.email,
                        phone: newrecord.phone,
                        matric: newrecord.matric,
                        course: newrecord.course,
                        department: newrecord.department,
                        level: newrecord.level,
                        address: newrecord.address,
                        parentname: newrecord.parentname,
                        parentphone: newrecord.parentphone,
                        nextofkin: newrecord.nextofkin                    
                    })
                } else {                
                    req.flash('success', 'New Record Added Successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New Record',
                        date:  date,
                        firstname: '',
                        lastname: '',
                        middlename: '',
                        dob: '',
                        age: '',
                        email: '',
                        phone: '',
                        matric: '',
                        course: '',
                        department: '',
                        level: '',
                        address: '',
                        parentname: '',
                        parentphone: '',
                        nextofkin: ''                    
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/add', { 
            title: 'Add New Record',
            date:  date,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            middlename: req.body.middlename,
            dob: req.body.dob,
            age: req.body.age,
            email: req.body.email,
            phone: req.body.phone,
            matric: req.body.matric,
            course: req.body.course,
            department: req.body.department,
            level: req.body.level,
            address: req.body.address,
            parentname: req.body.parentname,
            parentphone: req.body.parentphone,
            nextofkin: req.body.nextofkin
        })
    }
})
 
// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM students WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Student with ID = ' + req.params.id +' Not Found!')
                res.redirect('/users')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('user/edit', {
                    title: 'Edit User', 
                    //data: rows[0],
                    id: rows[0].id,
                    date:  date,
                    firstname: rows[0].firstname,
                    lastname: rows[0].lastname,
                    middlename: rows[0].middlename,
                    dob: rows[0].dob,
                    age: rows[0].age,
                    email: rows[0].email,
                    phone: rows[0].phone,
                    matric: rows[0].matric,
                    course: rows[0].course,
                    department: rows[0].department,
                    level: rows[0].level,
                    address: rows[0].address,
                    parentname: rows[0].parentname,
                    parentphone: rows[0].parentphone,
                    nextofkin: rows[0].nextofkin                    
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('firstname', 'First Name is required').notEmpty()           //Validate name
    req.assert('lastname', 'Last Name is required').notEmpty()
    req.assert('middlename', 'Middle Name is required').notEmpty()
    req.assert('age', 'Age is required').notEmpty()             //Validate age
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!

        var edituser = {
            firstname: req.sanitize('firstname').escape().trim(),
            lastname: req.sanitize('lastname').escape().trim(),
            middlename: req.sanitize('middlename').escape().trim(),
            dob: req.body.dob,
            age: req.sanitize('age').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            matric: req.body.matric,
            course: req.sanitize('course').escape().trim(),
            department: req.sanitize('department').escape().trim(),
            level: req.sanitize('level').escape().trim(),
            address: req.sanitize('address').escape().trim(),
            parentname: req.sanitize('parentname').escape().trim(),
            parentphone: req.sanitize('parentphone').escape().trim(),
            nextofkin: req.sanitize('nextofkin').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE students SET ? WHERE id = ' + req.params.id, edituser, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        date: date,
                        id: req.params.id,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        middlename: req.body.middlename,
                        dob: req.body.dob,
                        age: req.body.age,
                        email: req.body.email,
                        phone: req.body.phone,
                        matric: req.body.matric,
                        course: req.body.course,
                        department: req.body.department,
                        level: req.body.level,
                        address: req.body.address,
                        parentname: req.body.parentname,
                        parentphone: req.body.parentphone,
                        nextofkin: req.body.nextofkin
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        date: date,
                        id: req.params.id,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        middlename: req.body.middlename,
                        dob: req.body.dob,
                        age: req.body.age,
                        email: req.body.email,
                        phone: req.body.phone,
                        matric: req.body.matric,
                        course: req.body.course,
                        department: req.body.department,
                        level: req.body.level,
                        address: req.body.address,
                        parentname: req.body.parentname,
                        parentphone: req.body.parentphone,
                        nextofkin: req.body.nextofkin
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/edit', { 
            title: 'Edit User',
            date: date,            
            id: req.params.id, 
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            middlename: req.body.middlename,
            dob: req.body.dob,
            age: req.body.age,
            email: req.body.email,
            phone: req.body.phone,
            matric: req.body.matric,
            course: req.body.course,
            department: req.body.department,
            level: req.body.level,
            address: req.body.address,
            parentname: req.body.parentname,
            parentphone: req.body.parentphone,
            nextofkin: req.body.nextofkin
        })
    }
})
 
// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM students WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/users')
            } else {
                req.flash('success', 'Student Record Deleted Successfully!')
                // redirect to users list page
                res.redirect('/users')
            }
        })
    })
})
 
module.exports = app