//include database
const Customer = require('../models/customer');
const mongoose = require('mongoose');



/**
 * GET / 
 * Homepage
 */



exports.homepage = async (req, res) => {

    const messages = await req.consumeFlash('info');

    const locals = {
        title: 'Customer Management System',
        description: 'Free NodeJs User Management System'
    }

    let perPage = 3;
    let page = req.query.page || 1;


    try {
        const customers = await Customer.aggregate([ { $sort: { updatedAt: -1 } } ])
            .skip(perPage * page -perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.count();

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages
        });

    } catch (error){
        console.log(error);
    }


}



// exports.homepage = async (req, res) => {

//         const messages = await req.consumeFlash('info');

//         const locals = {
//             title: 'NodeJs',
//             description: 'Free NodeJs User Management System'
//         }

//         try {
//             const customers = await Customer.find({}).limit(22);
//             res.render('index', {locals, messages, customers });

//         } catch (error){
//             console.log(error);
//         }
    
    
// }

/**
 * GET / 
 * ABOUT
 */

exports.about = async (req, res) => {

        const messages = await req.consumeFlash('info');

        const locals = {
            title: 'About',
            description: 'Free NodeJs User Management System'
        }

        try {
            
            res.render('about', locals ); 

        } catch (error){
            console.log(error);
        }
    
    
}




/**
 * GET / 
 * New Customer Form
 */

exports.addCustomer = async (req, res) => {

        const locals = {
            title: 'Add New Customer - NodeJS',
            description: 'Free NodeJs User Management System'
        }

        res.render('customer/add', locals );


}


/**
 * POST / 
 * New Customer Form
 */

exports.postCustomer = async (req, res) => {

    console.log(req.body);


    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        cellphoneNum: req.body.cellphoneNum,
        email: req.body.email,
        details: req.body.details,

    })

   try {

    await Customer.create(newCustomer);
    await req.flash('info', 'New Customer has been added.')

    res.redirect('/');

   } catch (error){

    console.log(error);


   }


    


}


/**
 * VIEW / 
 * New Customer Form
 */

exports.view = async (req, res) => {

    try {
        const customer = await Customer.findOne( { _id:  req.params.id} )
        const locals = {
            title: 'View Customer Data',
            description: 'Free NodeJs User Management System'
        }   
    
        res.render('customer/view', {
            locals,
            customer
        })
    
    
    } catch (error) {
        console.log(error);
    }

}


/**
 * 
 * GET
 * EDIT / 
 * New Customer Form
 */

exports.edit = async (req, res) => {

    try {
        const customer = await Customer.findOne( { _id:  req.params.id} ) //query customer
        const locals = {
            title: 'Edit Customer Data',
            description: 'Free NodeJs User Management System' //this for the title information of the webpage
        }   
    
        res.render('customer/edit', { //this will render the info from the edit.ejs
            locals,
            customer
        })
    
    
    } catch (error) {
        console.log(error);
    }

}


/**
 * 
 * GET
 * UPDATE / 
 * Customer Form
 */

exports.editPost = async (req, res) => {

   try {
    
    await Customer.findByIdAndUpdate(req.params.id,{
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        cellphoneNum: req.body.cellphoneNum,
        email: req.body.email,
        details: req.body.details,
        updatedAt: Date.now()

    });

    await res.redirect(`/edit/${req.params.id}`); //this will trigger the update
    console.log('redirected');

   } catch (error) {
    
    console.log(error);

   }
}



/**
 * 
 * DELETE / 
 * Customer Data
 */

exports.deleteCustomer= async (req, res) => {

    try {
        await Customer.deleteOne({ _id: req.params.id });
        res.redirect("/")

    } catch (error) {

        console.log(error);

    }
    
 }
 
/**
 * 
 * search / 
 * Customer Data
 */

exports.searchCustomers= async (req, res) => {

    const locals = {
        title: 'Search Customer Data',
        description: 'Free NodeJs User Management System' //this for the title information of the webpage
    };   
 

    try {

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9 ]/g, "");
       
        const customers = await Customer.find({

            $or: [

                
                { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") }},
                { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") }},
           
           
            ]
        });

        res.render("search", {
            customers,
            locals
        })
    

    } catch (error) {
        console.log(error);
    }
   
    


 }
 
