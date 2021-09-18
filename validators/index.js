exports.createPostValidator = (req, res, next) => {
    req.check('title', 'Title cannot be empty').notEmpty();
    req.check('title', 'Title must between 4 to 150 characters').isLength({
        min: 4,
        max: 150,
    });

    req.check('body', 'Body cannot be empty').notEmpty();
    req.check('body', 'Body must between 4 to 2000 characters').isLength({
        min: 4,
        max: 150,
    });

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(400).json({
            error: firstError,
        });
    }

    next();
};

exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty();

    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 3,
            max: 32,
        });

    req.check('password', 'Password is required').notEmpty();
    req.check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(400).json({
            error: firstError,
        });
    }

    next();
};
