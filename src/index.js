import './styles.scss';

//MVC Model

class Model{
    constructor(){

        this.note = function(id, text, complete, dueDate, color) {
           this.id = id
           this.text = text
           this.complete = complete
           this.dueDate = dueDate
           this.color = color
        }

        let note1 = new this.note(0, 'Go for a walk', true, '2021-08-05', '#f45f02')
        let note2 = new this.note(1, 'Plant a seed', true, '2021-08-06', '#7ff402')
        let note3 = new this.note(2, 'Jogging 4km', false, '2021-08-07', '#7f02f4')

        let note4 = new this.note(0, 'Study Maths', false, '2021-08-06', '#9f02f4')
        let note5 = new this.note(1, 'Shopping', false, '2021-08-07', '#02f4a4')

        let note6 = new this.note(0, 'Furniture Repair', false, '2021-08-15', '#02f4cc')
        let note7 = new this.note(1, 'Car Wash', false, '2021-08-17', '#024bf4')

        this.categories = [{id : 0, title : 'Today', contains: [note1, note2, note3]}, {id : 1, title : 'Tomorrow', contains: [note4, note5]}, {id : 2, title : 'This Weekend' , contains : [note6, note7]}]
    }

    bindCategoryChange(callback) {
        this.onCategoryChange = callback
    }

    bindNoteChange(callback) {
        this.onNoteChange = callback
    }

    addCategory(text){
        const category = {
            id : this.categories.length > 0 ? this.categories.length : 0,
            title : text,
            contains : []
        }
        this.categories.push(category)

        this.onCategoryChange(this.categories)
    }

    addNote(catId, text, dueDate, color){
        let cat = this.categories[catId].contains
        let newnote = new this.note( cat.length > 0 ? cat.length : 0, text, false, dueDate, color)
        cat.push(newnote)
        // console.log(newnote)

        this.onNoteChange(this.categories[catId].contains)   
    }

    toggleNote(cat, note){
        let toChange = this.categories[cat].contains[note]
        toChange.complete = !toChange.complete

        this.onNoteChange(this.categories[cat].contains)   
    }

    deleteNote(info){
        let [cat, note] = info
        let toChange = this.categories[cat].contains
        toChange.splice(note, 1)

        // Update Ids on Deleting A Note
        for (let index in toChange){
            toChange[index].id = parseInt(index)
        }

        this.onNoteChange(this.categories[cat].contains)   
    }
}


class View{
    constructor(){

        this.app = this.getElement('#root')
        this.display = this.getElement('.display')

        // App Section : Categoreies & Tasks
        this.categoriesList = this.getElement('.Categories')
        this.tasks = this.getElement('.Tasks')
        this.show = this.getElement('.show')

        //Triggers
        this.addNewCategory = this.getElement('.fa-plus')
        this.newNote = this.getElement('.addNote')

        //Add Category : Forms for Input
        this.toggleCategoryView = this.getElement('.fa-chevron-right')

        //Notes
        this.addNote = this.getElement('.addNote')

        //Add Note Form
        this.addNoteForm = this.getElement('.addNoteForm')
        this.noteTitle = this.getElement('#noteTitle')
        this.noteDate = this.getElement('#noteDate')
        this.noteColor = this.getElement('#noteColor')
        this.cancelNote = this.getElement('.cancelNote')
        this.submitNote = this.getElement('.submitNote')

        //Variables
        this.lastCategorySelected = 0
    }

    createElement(tag, className){
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
        return element
    }

    getElement(selector){
        const element = document.querySelector(selector)
        return element
    }

    getElements(selector){
        const elements = document.querySelectorAll(selector)
        return elements
    }

    displayCategory(categories){
        // console.log('Displaying Categories Now')

        // Clear Previous
        while (this.categoriesList.firstChild){
            this.categoriesList.removeChild(this.categoriesList.firstChild)
        }

        if (categories.length > 0){
            categories.forEach( cat => {
                // console.log(cat)
                const li = this.createElement('li')
                li.classList.add('categoryElement')
                li.id = cat.id
                li.textContent = cat.title

                const i = this.createElement('i')
                i.classList.add('far', 'fa-folder')
                li.append(i)

                this.categoriesList.append(li)
            })
        }
    }

    bindToggleCategoryList(handler){
        this.toggleCategoryView.addEventListener('click', event => {
            // console.log('Toggling Category List')
            handler(this.categoriesList)
        })
    }

    bindAddNewCategory(handler){
        this.addNewCategory.addEventListener('click', event => {
            // console.log("New Category Detected")

            if (this.categoriesList.lastChild.id !== 'category-input'){

                let newInput = this.createElement('input')
                newInput.id = 'category-input'
                newInput.placeholder = 'New Category'

                this.categoriesList.append(newInput)
                this.removeCategoryInput(handler, newInput)
            }
        })
    }

    removeCategoryInput(handler, input){

        this.show.addEventListener('click', event =>{    //Abort bcz user escaped
            handler(0, true)            
        })

        input.addEventListener('keydown', event => {
            // console.log(event.key)
            if(event.key === 'Enter'){
                handler(input.value, false)             //false : Do not Refresh
            }
            else if (event.key === 'Escape'){
                handler(0, true)                        //Refresh bcz user escaped
            }
        })
    }

    bindLastSelectedAndHighlight(handler){
        // console.log('Highlighting Last Category Selected')

        const cats = this.categoriesList.childNodes
        Array.from(cats).forEach(e => 
            e.addEventListener('click', e => {
                const selected = e.target.id
                this.lastCategorySelected = selected
                handler(selected)
            })
        )
    }


    displayNotes(notes){
        // console.log('Displaying Notes Now')

        //Clear Previous Notes
        while (this.tasks.firstChild){
            this.tasks.removeChild(this.tasks.firstChild)
        }
        
        if (notes.length > 0){
            notes.forEach( note =>  { 

                const li = this.createElement('li')
                li.classList.add('noteElement')
                li.id = note.id

                const checkbox = this.createElement('input')
                checkbox.classList.add('checks')
                checkbox.type = 'checkbox'
                checkbox.checked = note.complete

                const para = this.createElement('p')
                para.textContent = note.text

                if (note.complete){
                    para.classList.add('strike')
                }

                const arrow = this.createElement('i')
                arrow.classList.add('fas', 'fa-bars')

                li.append(arrow, para, checkbox)

                this.tasks.append(li)
            })
        }
    }

    bindChecks(handler){
        // console.log('Binding Checks To Notes')

        const checks = this.getElements('.checks')
        Array.from(checks).forEach(e => e.addEventListener('change', event => {
            const cat = this.lastCategorySelected
            const note = event.target.parentElement.id
            handler(cat, note)
        }))
    }

    bindAddNote(handler){

        this.newNote.addEventListener('click', e => this.toggleNoteForm(e))
        this.cancelNote.addEventListener('click', e => this.toggleNoteForm(e))
        this.submitNote.addEventListener('click', e => {

            // console.log('New Note Detected')
            // console.log(this.noteTitle.value, this.noteDate.value, this.noteColor.value, '0')

            this.toggleNoteForm(e)
            handler (this.noteTitle.value, this.noteDate.value, this.noteColor.value)
        })
    }

    toggleNoteForm(e){
        // console.log("Toggling New Note Form")
        e.preventDefault()
        this.addNoteForm.classList.toggle('appear')
        this.display.classList.toggle('blur')
    }

    bindToggleNoteElement(handler){
        let noteBars = this.getElements('.fa-bars')

        Array.from(noteBars).forEach(e => e.addEventListener('click', event => {
            const appendTo = event.target.parentElement
            // console.log('Bar Toggle Detected')

            if(appendTo.nextSibling && appendTo.nextSibling.classList.contains('descElement')){
                // if(appendTo.nextSibling.classList.contains('descElement')){
                    // console.log('Removing Note if Present')
                    appendTo.nextSibling.remove()
                // }
            }
            else{
                // console.log('Adding Note if Absent')
                this.showFullNote([ appendTo ,handler(this.lastCategorySelected, appendTo.id)])
                // console.log([ appendTo ,handler(this.lastCategorySelected, appendTo.id)])
                //2. Hands over the handler for deleting note to showfullnote

            }
        }))

    }

    showFullNote(info){
        // console.log('Adding Description')
        // console.log(info)

        const [element, desc] = info
        let [date, color, handler] = desc

        let div = this.createElement('div')
        div.classList.add('descElement')

        let p = this.createElement('p')
        new Date(date).toDateString()
        p.append(new Date(date).toDateString().replace(' ', ', '))

        let i1 = this.createElement('i')
        i1.classList.add('fas', 'fa-superpowers')
        i1.style.color = color

        let i2 = this.createElement('i')
        i2.classList.add('fas', 'fa-trash-o')
        i2.style.color = color

        div.append(i1, p, i2)
        element.after(div)

        this.bindDeleteNote(handler)        
        //3. Hands over the handler for deleting note to bindDeleteNote
    }

    
    bindDeleteNote(handler){
        // console.log('Adding Delete btn')

        let deleteBtn = document.getElementsByClassName('fa-trash-o')
        Array.from(deleteBtn).forEach(e => e.addEventListener('click', event => {

            // console.log('Deleting Note Triggered')
            const catId = this.lastCategorySelected
            const note = event.target.parentElement.previousElementSibling

            if (note){                                  // If multiple notes are open note => undefined
                event.target.parentElement.remove()     //Remove Note Description
                note.remove()                           //Remove Note

                let toDelete = [catId, note.id]
                handler(toDelete)
                // Handler is used
            }
        }))
    }

}

class Controller{
    constructor(model, view){
        this.model = model
        this.view = view

        //Display Initial Tasks : Category and Note (Default : 0-> id ,0-> id)
        this.view.displayCategory(this.model.categories)
        // this.view.displayNotes(this.model.categories[this.view.lastCategorySelected].contains)

        //Refresh | Callback
        this.model.bindCategoryChange(this.onCategoryChange)
        this.model.bindNoteChange(this.onNoteChange)

        //Binds
        //Category Related
        this.view.bindToggleCategoryList(this.handleToggleCategoryList)
        this.view.bindAddNewCategory(this.handleAddCategory)
        this.view.bindLastSelectedAndHighlight(this.handleHighlightCategory)

        //Notes Related
        this.view.bindChecks(this.handleChecks)
        this.view.bindAddNote(this.handleAddNote)
        this.view.bindToggleNoteElement(this.handleToggleNoteElement)
    }

    //Handlers

    onCategoryChange = (categories) => {
        // console.log('Change in Category')
        this.view.displayCategory(categories)                                 //Update View
        this.view.bindLastSelectedAndHighlight(this.handleHighlightCategory) //Update Highlighted
        this.view.bindToggleNoteElement(this.handleToggleNoteElement)
    }


    onNoteChange = (notes) => {
        // console.log('Change in Notes')
        this.view.displayNotes(notes)                                    //Update View
        this.view.bindChecks(this.handleChecks)                         //Reassign Checks
        this.view.bindLastSelectedAndHighlight(this.handleHighlightCategory) //Re-Highlight
        this.view.bindToggleNoteElement(this.handleToggleNoteElement)
    }

    handleAddCategory = (title, refresh) => {
        if (refresh){
            // console.log('Aborted Adding Category')
            this.view.displayCategory(this.model.categories)
            this.view.bindLastSelectedAndHighlight(this.handleHighlightCategory) //Update Highlighted
        }
        else {
            // console.log('Adding Category')
            this.model.addCategory(title)
        }
    }


    handleToggleCategoryList = (categories) => {
        // console.log("Toggling Category List")

        //Hide
        if (categories.firstChild){
            while (categories.firstChild){categories.removeChild(categories.firstChild)}

            this.view.toggleCategoryView.classList.add('rotateDown')
            this.view.toggleCategoryView.classList.remove('rotateUp')
        } 
        
        //Show
        else {
            this.onCategoryChange(this.model.categories)        //Refresh
            this.view.toggleCategoryView.classList.remove('rotateDown')
            this.view.toggleCategoryView.classList.add('rotateUp')
        }

    }


    handleHighlightCategory = (category) => {
        
        // console.log('Higlighting Given Categories')

        this.onNoteChange(this.model.categories[category].contains)   

        const list = Array.from(this.view.categoriesList.childNodes)

        for (let item of list){
            //Highlight Requested
            if (item.id == category){
                item.classList.add('highlight')
            }
            else{
                //Turn off Others
                if(item.classList.contains('highlight')){ 
                    item.classList.remove('highlight')
                }
            } 
        }
    }


    handleChecks = (cat, note) =>{
        // console.log('Assingning Checks')
        this.model.toggleNote(cat, note)
    }

    handleAddNote = (title, date, color) => {
        // console.log('Adding Note')
        this.model.addNote(this.view.lastCategorySelected, title, date, color)
    }

    handleToggleNoteElement = (catId, note) => {
        // console.log('Sending Note info, and Deleting Note Handler')
        // console.log(catId, note)

        const theNote = this.model.categories[catId].contains[note]
        if (theNote){
            return [theNote.dueDate, theNote.color, this.handleDeleteNote]
        }
        //1. Sends the delete note handler to toggleNoteElement

    }

    handleDeleteNote = (info) => {
        // console.log('Updating Model for Deleted Note')
        this.model.deleteNote(info)
    }

}

const app = new Controller(new Model(), new View())

