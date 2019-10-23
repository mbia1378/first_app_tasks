'use strict'

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {
    async index ({view}){
        const tasks = await Task.all()

        return view.render('tasks.index', {tasks: tasks.toJSON()})
    }

    async store ({request,response,session}){
        // validation des entrées du formulaire
        const validation = await validate(request.all(),{
            title: 'required|min:3|max:255'
        })

        // Afficher les erreurs si la validation a échouée
        if (validation.fails()){
            session.withErrors(validation.messages())
                .flashAll()

            return response.redirect('back')
        }

        // persister les données dans la base de données
        const task = new Task()
        task.title = request.input('title')
        await task.save()

        // Afficher le message de succès à la session
        session.flash({notification: 'Tâche ajoutée'})

        return response.redirect('back')
    }

    async destroy ({params, session, response}){
        const task = await Task.find(params.id)
        await task.delete()

        // Afficher le message de succès à la session

        session.flash({ notification: 'Tâche supprimée!' })

        return response.redirect('back')
    }
}

module.exports = TaskController
