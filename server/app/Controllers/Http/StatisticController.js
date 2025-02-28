'use strict'

const Budget = use('App/Models/Budget')

class StatisticController {

    async current({ response, auth }) {
        const query = await Budget.with('user')
            .with('expenses')
            .setVisible(['limit', 'created_at'])
            .where('current', true)
            .where('user_id', auth.user._id)
            .first()

        if (query === null) return response.forbidden()

        const queryJSON = query.toJSON();

        const firstDayOfBudget = new Date(queryJSON.created_at)

        if (firstDayOfBudget.getDate() != 1 || !auth.user.defaultBudget) {
            return response.forbidden()
        }

        const budgetLimit = queryJSON.limit

        const expensesTotal = queryJSON.expenses.reduce((accumulator, expense) => {
            return accumulator += parseFloat(expense.price)
        }, 0)

        if (expensesTotal === 0) {
            return response.forbidden()
        }

        /// Percentage budget spent ///
        const budgetSpentPercentage = (parseFloat(expensesTotal) / parseFloat(budgetLimit) * 100).toFixed(0)

        /// Spending progression by 10 days ///
        const arrayExpensesBy10Days = this.getSpendingProgression(queryJSON, firstDayOfBudget, expensesTotal)

        /// Percentage of cost by categories and number of expenses by categories ///
        const arrayNumberOfExpensesByCategories = this.getCategoriesData(queryJSON, expensesTotal)[0]
        const arrayPercentageCostByCategories = this.getCategoriesData(queryJSON, expensesTotal)[1]

        /// Average spending for each day ///
        const arrayTotalSpendingPerDay = this.getTotalSpending(queryJSON)

        return response.accepted({
            currency: auth.user.currency,
            expensesTotal: expensesTotal,
            budgetLimit: budgetLimit,
            budgetSpentPercentage: budgetSpentPercentage,
            arrayExpensesBy10Days: arrayExpensesBy10Days,
            arrayNumberOfExpensesByCategories: arrayNumberOfExpensesByCategories,
            arrayPercentageCostByCategories: arrayPercentageCostByCategories,
            arrayTotalSpendingPerDay: arrayTotalSpendingPerDay
        })
    }

    getSpendingProgression(queryJSON, firstDayOfBudget, expensesTotal) {

        const lastDayOfBudget = new Date(new Date(queryJSON.created_at).getFullYear(), new Date(queryJSON.created_at).getMonth() + 1, 0)

        let arrayExpensesBy10Days = [{ totalSpending: 0, progression: 0, date: new Date(queryJSON.created_at) }]
        let progression = 0
        let spending = 0

        for (let i = 10; i <= 21; i += 10) {
            const deadline = new Date(firstDayOfBudget.setDate(firstDayOfBudget.getDate() + 10))
            const expensesBy10Days = queryJSON.expenses.reduce((accumulator, expense) => {
                if (new Date(expense.created_at).getDate() < deadline.getDate()) {
                    return accumulator += parseFloat(expense.price)
                }
                return accumulator
            }, 0)

            progression = expensesBy10Days - progression
            spending = expensesBy10Days

            arrayExpensesBy10Days.push({ totalSpending: expensesBy10Days, progression: progression, date: deadline })
        }
        arrayExpensesBy10Days.push({ totalSpending: expensesTotal, progression: expensesTotal - spending, date: lastDayOfBudget })

        return arrayExpensesBy10Days
    }

    getCategoriesData(queryJSON, expensesTotal) {
        const categories = ['Food', 'Apartment', 'Restaurant', 'Sport', 'Parties', 'Shopping', 'Travel', 'Other']

        let arrayNumberOfExpensesByCategories = []

        categories.forEach(category => {
            const arrayOfExpenses = queryJSON.expenses.filter(expense => expense.type === category)
            arrayOfExpenses.length === 0 ? arrayNumberOfExpensesByCategories.push(0) : arrayNumberOfExpensesByCategories.push(arrayOfExpenses.length)
        })

        let arrayPercentageCostByCategories = []

        categories.forEach(category => {
            const arrayOfExpenses = queryJSON.expenses.filter(expense => expense.type === category)
            if (arrayOfExpenses.length > 0) {
                const reducer = arrayOfExpenses.reduce((accumulator, expense) => {
                    return accumulator += parseFloat(expense.price)
                }, 0)
                arrayPercentageCostByCategories.push(parseFloat((parseFloat(reducer) / parseFloat(expensesTotal) * 100).toFixed(1)))
            } else {
                arrayPercentageCostByCategories.push(0)
            }
        })

        return [arrayNumberOfExpensesByCategories, arrayPercentageCostByCategories]
    }

    getTotalSpending(queryJSON) {
        const totalSpending = queryJSON.expenses.map((expense) => {
            return { day: new Date(expense.created_at).getDay() - 1, price: expense.price }
        })

        let arrayTotalSpendingPerDay = [0, 0, 0, 0, 0, 0, 0]

        totalSpending.forEach(expense => {
            if (expense.day === -1) {
                arrayTotalSpendingPerDay[arrayTotalSpendingPerDay.length - 1] += parseFloat(expense.price)
            } else {
                arrayTotalSpendingPerDay[expense.day] += parseFloat(expense.price)
            }
        })

        return arrayTotalSpendingPerDay
    }
}

module.exports = StatisticController
