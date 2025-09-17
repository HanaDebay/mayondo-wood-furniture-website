//Ensure user is authenticated 
exports.ensureAuthenticated = (req ,res,next) => {
    if(req.session.user){
        return next()
    }
    res.redirect("/login")
};

//Ensure user is a Sales-Agent
exports.ensureSalesAgent = (req ,res,next) => {
    console.log("Session user:", req.session.user);
    console.log("Session role:", req.session.role);

    if(req.session.user && req.session.role === "Sales-Agent"){
        return next()
    }
    res.redirect("/login")
};

//Ensure user is a Manager
exports.ensureManager = (req ,res,next) => {
    if(req.session.user && req.session.role === "Manager"){
        return next()
    }
    res.redirect("/login")
};