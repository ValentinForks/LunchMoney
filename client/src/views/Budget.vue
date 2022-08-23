<template>
  <div class="w-full h-full main-budget">
    <div class="flex justify-end w-5/6 pt-4 mx-auto header">
      <div class="relative focus:outline-none">
        <router-link to="/dashboard"
                     :class="['cursor-pointer no-highlight-color bg-lunchPink-600 flex items-center block py-1 px-5 rounded-full text-lunchPurple-700 text-center font-black focus:outline-none']"
        >
          <svg class="mr-2" width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.223448 4.91581L4.54156 0.242268C4.84002 -0.080756 5.32263 -0.080756 5.61791 0.242268L6.33548 1.0189C6.63394 1.34192 6.63394 1.86426 6.33548 2.18385L3.27788 5.5L6.33866 8.81271C6.63712 9.13574 6.63712 9.65807 6.33866 9.97766L5.62109 10.7577C5.32263 11.0808 4.84002 11.0808 4.54474 10.7577L0.226623 6.08419C-0.0750098 5.76117 -0.0750097 5.23883 0.223448 4.91581Z" fill="#12012F" />
          </svg>
          Dashboard
        </router-link>
      </div>
    </div>
    <div v-if="validParams" class="w-5/6 mx-auto mt-4 dashboard" style="height:88%;">
      <div class="' border border-lunchPink-600 bg-lunchPurple-800 rounded-lunch h-32 w-full'">
        <div class="flex items-center justify-between">
          <h2 class="mt-2 ml-4 text-xl italic font-black text-lunchPink-600">BUDGET</h2>
          <h2 class="mt-2 mr-4 text-lg italic font-bold text-white uppercase">{{ month }}</h2>
        </div>
        <div class="flex items-center justify-center mx-4 mt-2 text-xl italic font-bold text-white bg-lunchPurple-500 rounded-expenses h-13">
          <svg class="inline-block w-4 h-auto mr-2" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1146 0L12 3.4375H9.89375L8.45208 0H10.1146ZM7.44792 0L8.88958 3.4375H3.11042L4.55208 0H7.44792ZM1.88542 0H3.54792L2.10625 3.4375H0L1.88542 0ZM0 4.125H2.09792L4.66042 9.53262C4.69167 9.59922 4.60417 9.65938 4.55625 9.60352L0 4.125ZM3.0875 4.125H8.9125L6.05833 10.9613C6.0375 11.0129 5.96458 11.0129 5.94375 10.9613L3.0875 4.125ZM7.33958 9.53262L9.90208 4.125H12L7.44375 9.60137C7.39583 9.65938 7.30833 9.59922 7.33958 9.53262Z" fill="#E2E8F0" />
          </svg>
          <span>{{ parseFloat(currentBalance).toFixed(2) }}</span>
          <span class="text-2xl italic font-bold text-lunchPurple-100">/</span>
          <span class="text-lunchPink-600">{{ parseFloat(limit).toFixed(2) }}</span>
          <span class="mt-1 ml-1 text-base not-italic">{{ this.$store.state.currentCurrency }}</span>
        </div>
      </div>
      <div class="flex items-center justify-center mt-4 ">
        <div class="relative flex items-center w-1/3 mr-2">
          <div @click="editBudget = !editBudget"
               :class="['cursor-pointer no-highlight-color bg-lunchPink-600 w-full inline-block  py-2 rounded-full text-lunchPurple-700 text-center font-black uppercase text-xs focus:outline-none focus:bg-lunchPink-700']"
          >
            <i class="mr-1 text-xs fas fa-edit text-lunchPurple-700"></i>EDIT</div>
        </div>
        <div v-if="isCurrentBudget" class="relative flex items-center w-1/3 mr-2">
          <div @click="archiveBudget = !archiveBudget" 
               :class="['cursor-pointer no-highlight-color bg-lunchPink-600 w-full inline-block  py-2 rounded-full text-lunchPurple-700 text-center font-black uppercase text-xs focus:outline-none focus:bg-lunchPink-700']"
          >
            <i class="mr-1 text-xs fas fa-archive text-lunchPurple-700"></i>ARCHIVE</div>
        </div>
        <div class="relative flex items-center w-1/3">
          <div @click="deleteBudget = !deleteBudget"  
               :class="['cursor-pointer no-highlight-color bg-lunchPurple-900 w-full inline-block  py-2 rounded-full text-lunchPink-600 text-center font-black uppercase text-xs focus:outline-none focus:bg-lunchPink-700']"
          >
            <i class="mr-1 text-xs fas fa-trash-alt text-lunchPink-600"></i>DELETE</div>
        </div>

      </div>
      <!-- EXPENSES SHOW -->
      <div class="mt-4 border expenseTab border-lunchPink-600 rounded-lunch" style="height:calc(100% - 194px);">
        <h2 class="mx-auto mt-5 mb-2 text-base italic font-black w-17/20 text-lunchPink-600">EXPENSES IN THIS BUDGET</h2>
        <div v-if="expenses.length > 0" class="overflow-y-scroll w-ful" style="height:calc(100% - 80px);">
          <div v-for="(expense, index) in expenses.slice().reverse()" :key="`expense-${index}`"
               v-touch:swipe.left="swipe(index)"
               v-touch:swipe.right="swipe(index)"
               :id="index"
               class="flex items-center mx-4 mb-2 bg-lunchPurple-500 rounded-expenses h-13"
          >
            <svg class="ml-4" width="18" height="18" :viewBox="getViewBox(expense.type)" xmlns="http://www.w3.org/2000/svg">
              <path v-if="expense.type === 'Other'" d="M14.7826 6.61936L8.49238 0.411885C8.22514 0.148161 7.86269 1.95022e-06 7.48476 0H1.425C0.637985 0 0 0.62959 0 1.40625V7.38627C1.97623e-06 7.75923 0.150137 8.11691 0.417377 8.38063L6.70763 14.5881C7.26409 15.1373 8.16635 15.1373 8.72287 14.5881L14.7826 8.60809C15.3391 8.05892 15.3391 7.16853 14.7826 6.61936ZM3.325 4.6875C2.53799 4.6875 1.9 4.05791 1.9 3.28125C1.9 2.50459 2.53799 1.875 3.325 1.875C4.11202 1.875 4.75 2.50459 4.75 3.28125C4.75 4.05791 4.11202 4.6875 3.325 4.6875ZM18.5826 8.60809L12.5229 14.5881C11.9664 15.1373 11.0641 15.1373 10.5076 14.5881L10.4969 14.5776L15.6643 9.47818C16.169 8.98016 16.4469 8.31802 16.4469 7.61373C16.4469 6.90943 16.1689 6.24729 15.6643 5.74928L9.83835 0H11.2848C11.6627 1.95022e-06 12.0251 0.148161 12.2924 0.411885L18.5826 6.61936C19.1391 7.16853 19.1391 8.05892 18.5826 8.60809Z" fill="#F71140" />
              <path v-if="expense.type === 'Food'" d="M11.7475 4.2832C12.617 4.43826 13.3302 4.90311 13.8876 5.67773C14.3781 6.36404 14.7126 7.22732 14.8907 8.26758C15.0471 9.21951 15.0354 10.1711 14.8573 11.123C14.5897 12.6946 14.0547 14.0117 13.2521 15.0742C12.2932 16.3582 11.0896 17 9.64048 17C9.28357 17 8.89384 16.8894 8.46996 16.668C8.18001 16.491 7.85691 16.4023 7.5 16.4023C7.14309 16.4023 6.82032 16.491 6.53004 16.668C6.10616 16.8894 5.71643 17 5.35952 17C3.91043 17 2.70677 16.3582 1.74785 15.0742C0.945299 14.0117 0.410262 12.6946 0.142744 11.123C-0.0353783 10.1711 -0.0470969 9.21951 0.109262 8.26758C0.287385 7.22732 0.621866 6.36404 1.11237 5.67773C1.66984 4.90311 2.383 4.43826 3.25252 4.2832C3.78756 4.19455 4.52315 4.27225 5.45963 4.51562C6.26218 4.73709 6.9422 5.00271 7.49967 5.3125C8.05713 5.00271 8.73715 4.73709 9.5397 4.51562C10.4765 4.27225 11.2124 4.19455 11.7475 4.2832ZM9.908 2.92188C9.59595 3.20975 9.18312 3.41992 8.67052 3.55273C8.3136 3.6633 7.92388 3.71875 7.5 3.71875L6.99844 3.68555C6.95391 3.37576 6.95391 3.02148 6.99844 2.62305C7.08784 1.82617 7.34398 1.21756 7.76752 0.796875C8.07957 0.509004 8.4924 0.298828 9.005 0.166016C9.36191 0.0554492 9.75164 0 10.1755 0L10.6771 0.0332031L10.7106 0.53125C10.7106 0.951934 10.6546 1.33908 10.5435 1.69336C10.4099 2.20236 10.1983 2.61209 9.908 2.92188Z" fill="#F71140" />        
              <path v-if="expense.type === 'Apartment'" d="M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z" fill="#F71140" />
              <path v-if="expense.type === 'Restaurant'" d="M6.99663 0.504734C7.02356 0.660788 7.53846 3.64242 7.53846 4.78128C7.53846 6.5178 6.60289 7.75628 5.21971 8.25432L5.65385 16.16C5.6774 16.6148 5.31058 17 4.84615 17H2.69231C2.23125 17 1.86106 16.6182 1.88462 16.16L2.31875 8.25432C0.932212 7.75628 0 6.51448 0 4.78128C0 3.6391 0.514904 0.660788 0.541827 0.504734C0.649519 -0.169288 2.06635 -0.179249 2.15385 0.541257V5.22953C2.1976 5.34242 2.66202 5.33578 2.69231 5.22953C2.73942 4.38949 2.95817 0.607663 2.96154 0.521335C3.0726 -0.169288 4.46587 -0.169288 4.57356 0.521335C4.58029 0.610983 4.79567 4.38949 4.84279 5.22953C4.87308 5.33578 5.34087 5.34242 5.38125 5.22953V0.541257C5.46875 -0.175929 6.88894 -0.169288 6.99663 0.504734V0.504734ZM11.0082 9.99084L10.5034 16.1367C10.463 16.6016 10.8365 17 11.3077 17H13.1923C13.6399 17 14 16.6447 14 16.2031V0.79692C14 0.35864 13.6399 4.74401e-05 13.1923 4.74401e-05C10.4159 4.74401e-05 5.74135 5.92679 11.0082 9.99084Z" fill="#F71140" />        
              <path v-if="expense.type === 'Sport'" d="M104 96h-48C42.75 96 32 106.8 32 120V224C14.33 224 0 238.3 0 256c0 17.67 14.33 32 31.1 32L32 392C32 405.3 42.75 416 56 416h48C117.3 416 128 405.3 128 392v-272C128 106.8 117.3 96 104 96zM456 32h-48C394.8 32 384 42.75 384 56V224H256V56C256 42.75 245.3 32 232 32h-48C170.8 32 160 42.75 160 56v400C160 469.3 170.8 480 184 480h48C245.3 480 256 469.3 256 456V288h128v168c0 13.25 10.75 24 24 24h48c13.25 0 24-10.75 24-24V56C480 42.75 469.3 32 456 32zM608 224V120C608 106.8 597.3 96 584 96h-48C522.8 96 512 106.8 512 120v272c0 13.25 10.75 24 24 24h48c13.25 0 24-10.75 24-24V288c17.67 0 32-14.33 32-32C640 238.3 625.7 224 608 224z" fill="#F71140" />        
              <path v-if="expense.type === 'Parties'" d="M13.1429 2.375H11.4286V0.96875C11.4286 0.502754 11.0448 0.125 10.5714 0.125H0.857143C0.38375 0.125 0 0.502754 0 0.96875V15.0312C0 15.4972 0.38375 15.875 0.857143 15.875H10.5714C11.0448 15.875 11.4286 15.4972 11.4286 15.0312V13.5508L14.3074 12.286C15.3356 11.8342 16 10.8261 16 9.71773V5.1875C16 3.63669 14.7183 2.375 13.1429 2.375ZM13.7143 9.71773C13.7142 9.82638 13.6822 9.93268 13.6221 10.0238C13.5621 10.115 13.4765 10.1871 13.3758 10.2314L11.4286 11.0869V4.625H13.1429C13.4579 4.625 13.7143 4.87735 13.7143 5.1875V9.71773ZM7.42857 12.5C7.113 12.5 6.85714 12.2481 6.85714 11.9375V4.0625C6.85714 3.75186 7.113 3.5 7.42857 3.5C7.74414 3.5 8 3.75186 8 4.0625V11.9375C8 12.2481 7.74414 12.5 7.42857 12.5ZM4 12.5C3.68443 12.5 3.42857 12.2481 3.42857 11.9375V4.0625C3.42857 3.75186 3.68443 3.5 4 3.5C4.31557 3.5 4.57143 3.75186 4.57143 4.0625V11.9375C4.57143 12.2481 4.31557 12.5 4 12.5Z" fill="#F71140" />        
              <path v-if="expense.type === 'Shopping'" d="M16.5037 9.34698L17.981 2.89478C18.0877 2.42891 17.731 1.98529 17.2497 1.98529H4.97525L4.68881 0.595278C4.61744 0.248813 4.31031 0 3.95403 0H0.75C0.335781 0 0 0.333312 0 0.744485V1.24081C0 1.65198 0.335781 1.98529 0.75 1.98529H2.93384L5.12909 12.6387C4.60391 12.9385 4.25 13.5007 4.25 14.1452C4.25 15.1046 5.0335 15.8824 6 15.8824C6.9665 15.8824 7.75 15.1046 7.75 14.1452C7.75 13.659 7.54853 13.2197 7.22425 12.9044H13.7757C13.4515 13.2197 13.25 13.659 13.25 14.1452C13.25 15.1046 14.0335 15.8824 15 15.8824C15.9665 15.8824 16.75 15.1046 16.75 14.1452C16.75 13.4574 16.3472 12.8631 15.7632 12.5816L15.9356 11.8286C16.0422 11.3627 15.6855 10.9191 15.2042 10.9191H6.81616L6.61163 9.92647H15.7724C16.1226 9.92647 16.4262 9.68594 16.5037 9.34698Z" fill="#F71140" />          
              <path v-if="expense.type === 'Travel'" d="M14 3V11C14 12.6192 12.0742 14 9.93681 14L11.9049 15.5538C12.0908 15.7005 11.9863 16 11.75 16H2.25C2.01319 16 1.90962 15.7002 2.09509 15.5538L4.06319 14C1.93187 14 0 12.6236 0 11V3C0 1.34316 2 0 4 0H10C12.0312 0 14 1.34316 14 3ZM6.25 7.25V3.75C6.25 3.33578 5.91422 3 5.5 3H2.25C1.83578 3 1.5 3.33578 1.5 3.75V7.25C1.5 7.66422 1.83578 8 2.25 8H5.5C5.91422 8 6.25 7.66422 6.25 7.25ZM12.5 7.25V3.75C12.5 3.33578 12.1642 3 11.75 3H8.5C8.08578 3 7.75 3.33578 7.75 3.75V7.25C7.75 7.66422 8.08578 8 8.5 8H11.75C12.1642 8 12.5 7.66422 12.5 7.25ZM11 9C10.1716 9 9.5 9.67156 9.5 10.5C9.5 11.3284 10.1716 12 11 12C11.8284 12 12.5 11.3284 12.5 10.5C12.5 9.67156 11.8284 9 11 9ZM3 9C2.17156 9 1.5 9.67156 1.5 10.5C1.5 11.3284 2.17156 12 3 12C3.82844 12 4.5 11.3284 4.5 10.5C4.5 9.67156 3.82844 9 3 9Z" fill="#F71140" />        
            </svg>
            <div class="w-3/4 ml-2">
              <div class="flex justify-between">
                <h4 class="text-sm font-bold text-white"><span class="overflow-x-hidden text-base font-bold text-lunchPink-600">-{{ parseFloat(expense.price).toFixed(2) }}</span> {{ $store.state.currentCurrency }}</h4>
                <span class="text-xs italic font-bold text-lunchPink-600">{{ formatDate(expense.created_at) }}</span>
              </div>
              <p v-if="expense.description === null" class="-mt-1 text-xs text-lunchPurple-100">No description</p>
              <p v-else class="-mt-1 text-xs text-lunchPurple-100">{{ truncateDesc(expense.description, 25) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center mx-auto w-17/20 rounded-lunch bg-lunchPurple-500" style="height:calc(100% - 80px);">
          <svg width="70" height="46" viewBox="0 0 70 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M69.0202 21.5515L56.1762 2.56043C55.6435 1.77282 54.9217 1.12703 54.075 0.680376C53.2283 0.233721 52.2828 1.49722e-05 51.3225 0H18.6775C17.7172 3.03184e-06 16.7717 0.233705 15.925 0.680362C15.0783 1.12702 14.3566 1.77281 13.8239 2.56043L0.979757 21.5515C0.340895 22.496 -1.40647e-05 23.6058 4.35203e-10 24.7409L4.35204e-10 40.25C4.35204e-10 43.4257 2.61163 46 5.83333 46H64.1667C67.3884 46 70 43.4257 70 40.25V24.7409C70 23.6058 69.6591 22.496 69.0202 21.5515ZM19.7181 7.66667H50.282L60.6523 23H45.6944L41.8056 30.6667H28.1944L24.3056 23H9.34767L19.7181 7.66667Z" fill="#F71140" />
          </svg>
          <h3 class="mt-4 text-xs italic text-lunchPurple-100">NO EXPENSES</h3>
        </div>
      </div>
      <modal-edit-budget v-if="editBudget" @closing-modal="editBudget = false" :limit="limit" :budget-id="budgetID"></modal-edit-budget>
      <modal-archive-budget v-if="archiveBudget" @closing-modal="archiveBudget = false" :budget-id="budgetID"></modal-archive-budget>
      <modal-delete-budget v-if="deleteBudget" @closing-modal="deleteBudget = false" :budget-id="budgetID"></modal-delete-budget>
      <modal-delete-expense v-if="deleteExpense" @closing-modal="deleteExpense = false" :expense-id="expenses.slice().reverse()[selectedExpense]._id"></modal-delete-expense>
      <modal-edit-expense v-if="editExpense" @closing-modal="editExpense = false" :expense="expenses.slice().reverse()[selectedExpense]"></modal-edit-expense>

    </div>
    <div v-else-if="validParams = false" class="w-full text-center">
      <h1 class="mt-10 text-xl font-black text-white">ACCES DENIED</h1>
    </div>
  </div></template>

<script>
import ModalEditBudget from '../components/ModalEditBudget.vue'
import ModalArchiveBudget from '../components/ModalArchiveBudget.vue'
import ModalDeleteBudget from '../components/ModalDeleteBudget.vue'
import ModalDeleteExpense from '../components/ModalDeleteExpense.vue'
import ModalEditExpense from '../components/ModalEditExpense.vue'

import { EventBus } from './../eventBus.js'

export default {
  components: {
    ModalEditBudget,
    ModalArchiveBudget,
    ModalDeleteBudget,
    ModalDeleteExpense,
    ModalEditExpense
  },
  data() {
    return {
      validParams: null,
      budgetID: this.$route.params.id,
      limit: null,
      month: '',
      expenses: [],
      isCurrentBudget: null,
      editBudget: false,
      archiveBudget: false,
      deleteBudget: false,
      currentBalance: null,
      selectedExpense: null,
      deleteExpense: false,
      editExpense: false
    }
  },
  created() {
    this.getBudget()
    EventBus.$on('budget-edited', () => {
      this.getBudget()
    })
    EventBus.$on('expense-deleted', () => {
      this.getBudget()
    })
    EventBus.$on('expense-edited', () => {
      this.getBudget()
    })
    EventBus.$on('budget-archived', () => {
      this.isCurrentBudget = false
    })
    EventBus.$on('budget-deleted', () => {
      this.$router.push('/dashboard')
    })
  },
  methods: {
    getViewBox(type) {
      switch (type) {
        case 'Apartment':
          return '0 0 576 512'
      case 'Sport':
          return '0 0 640 512'
        default:
          return '0 0 19 15'
      }
    },
    swipe(param) {
      return (direction, event) => {
        console.log(direction, param)
        if (direction === 'right') {
          let expenseDiv = document.getElementById(param)
          expenseDiv.className += ' swipe-right-delete'
          setTimeout(() => {
            this.selectedExpense = param
            this.deleteExpense = true
            expenseDiv.classList.remove('swipe-right-delete')
          }, 400)
        }
        if (direction === 'left') {
          let expenseDiv = document.getElementById(param)
          expenseDiv.className += ' swipe-left-edit'
          setTimeout(() => {
            this.selectedExpense = param
            this.editExpense = true
            expenseDiv.classList.remove('swipe-left-edit')
          }, 400)
        }
      }
    },
    getBudget() {
      this.$axios.get(`/budget/expenses/${this.budgetID}`)
        .then(res => {
          console.log(res)
          if (res.status === 202) {
            this.isCurrentBudget = res.data.current
            this.limit = res.data.limit
            this.month = this.fullDate(res.data.created_at)
            this.expenses = res.data.expenses
            this.currentBalance = this.getCurrentBalance()
            this.validParams = true
          }
          else {
            this.validParams = false
          }
        })
        .catch()
    },
    fullDate: (dateToParse) => {
      let date = new Date(dateToParse)
      console.log(date)
      return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date) + ' ' + date.getFullYear()
    },
    getCurrentBalance() {
      return this.expenses.reduce((currentTotal, expense) => {
        return parseFloat(expense.price) + currentTotal
      }, 0)
    },
    truncateDesc(str, num) {
      return str.length <= num ? str : str.slice(0, num) + '...'
    },
    formatDate(dateToParse) {
      let date = new Date(dateToParse)
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: '2-digit' })
    },
  },
}
</script>