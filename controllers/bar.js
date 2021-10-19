const barRouter = require("express").Router();
const Bar = require('../models/Bar')


barRouter.get("/", async (req, res) => {
    const bares = await Bar.find({})
    bares ? res.json(bares) : res("Not found bares")
});

barRouter.post("/", async (req, res) => {
    try {
        const { body } = req;
        const { nombreBar, celular, direccion, estado, descripcion, like, email, facebook, instagram } = body;
        const bar = new Bar({
            nombreBar,
            celular,
            direccion,
            estado,
            descripcion,
            like,
            email,
            facebook,
            instagram,
            USER_ROLE: "manager",
            avatar: "https://res.cloudinary.com/luis-and-emma-1851654/image/upload/v1629990322/gojgnfychbpzrhe7at2v.png",
            cloudinary_id: "gojgnfychbpzrhe7at2v",
            fechaCreacion: new Date(),
        })

        const savedBar = await bar.save();
        res.status(201).json(savedBar);

    } catch (error) {
        res.status(400).json(error.message);
    }
})

barRouter.get("/:id" , async (req , res ) => {
    const { id } = req.params;
    try {
        const bar = await Bar.findById(id)
        res.json(bar)
    } catch (error) {
        console.log(error.message);
    }
   
})



module.exports = barRouter;