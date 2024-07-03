const express = require('express')
const Paper = require('./../models/paper')
const router = express.Router()

router.get('/new', (req, res) =>{
    res.render('papers/new', {paper: new Paper( )})
})

router.get('/:id', async (req, res) => {
    const paper = await Paper.findById(req.params.id)
    if (paper == null) res.redirect('/')
    res.render('papers/show', {paper: paper})
})

router.post('/', async (req, res) => {
    let paper = new Paper({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    })
    try{
        paper = await paper.save()
        res.redirect('/papers/${paper.id}')
    }catch(e){
        console.log(e)
        res.render('papers/new', {paper: paper})

    }
    
})

router.delete('/:id', async (req, res) => {
    await Paper.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

module.exports = router