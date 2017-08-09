<template>
  <div id="app">
    <div class="container">
      <div id="progress">
        <div id="progress-inner" :style="{ width: percentComplete }"></div>
      </div>

      <div id="buttons">
        <button @click.prevent="confirmReset()" v-show="tasks.length && !isConfirmingReset">reset</button>
        <button class="danger" @click.prevent="reset()" v-show="isConfirmingReset" :disabled="isResetDisabled">are you sure?</button>
      </div>

      <form @submit.prevent="add">
        <input v-model="newTaskText" type="text">
      </form>

      <ul>
        <li v-for="task in tasks"
          :class="{ completed: task.isComplete }"
          :key="task.key">
          <a href="#" @click.prevent="toggleIsComplete(task)">{{ task.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import id from './lib/id'

export default {
  name: 'app',
  data () {
    const savedTasks = window.sessionStorage.getItem('tasks')
    const tasks = savedTasks ? JSON.parse(savedTasks) : []
    return {
      tasks,
      newTaskText: '',
      isConfirmingReset: false,
      isResetDisabled: false
    }
  },
  methods: {
    add () {
      this.tasks.unshift({
        id: id(),
        createdAt: new Date(),
        isComplete: false,
        title: this.newTaskText.trim()
      })
      this.newTaskText = ''
    },
    toggleIsComplete (task) {
      this.tasks = this.tasks.map((t) => {
        if (t.id === task.id) {
          return Object.assign({}, task, { isComplete: !task.isComplete })
        } else {
          return t
        }
      })
    },
    confirmReset () {
      this.isConfirmingReset = true
      this.isResetDisabled = true
      setTimeout(() => { this.isConfirmingReset = false }, 8000)
      setTimeout(() => { this.isResetDisabled = false }, 100)
    },
    reset () {
      this.tasks = []
      this.isConfirmingReset = false
    }
  },
  watch: {
    tasks () {
      console.log('saving tasks to session storage')
      window.sessionStorage.setItem('tasks', JSON.stringify(this.tasks))
    }
  },
  computed: {
    sortedTasks () {
      return this.tasks.sort((a, b) => {
        if (a.isComplete && !b.isComplete) { return 1 }
        if (b.isComplete && !a.isComplete) { return -1 }
        return a.createdAt - b.createdAt
      })
    },
    percentComplete () {
      if (!this.tasks.length) { return '0%' }

      const completed = this.tasks.reduce((result, task) => {
        return task.isComplete ? result + 1 : result
      }, 0)
      return Math.round(100 * completed / this.tasks.length) + '%'
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Open Sans", "Segoe UI", Avenir, -apple-system, Roboto, system-ui, Ubuntu, Tahoma, Verdana, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #eee;
  background-color: #3a333a;
  font-weight: 100;
  font-size: 18pt;
}

.container {
  width: 95%;
  max-width: 500px;
  margin: 0 auto;
}

button {
  background: transparent;
  border: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;

  &[disabled] {
    cursor: default;
  }
}

a {
  text-decoration: none;
  color: inherit;
}

#progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;

  &-inner {
    height: 5px;
    background-color: #efe;
  }
}

#buttons {
  position: fixed;
  top: 1em;
  right: 1em;
  font-size: 70%;

  button {
    display: inline-block;
    padding: 0.5em;
  }

  .danger {
    background-color: #c03;
    &[disabled] {
      background-color: darken(#c03, 20%);
    }
  }
}

input {
  width: 100%;
  font: inherit;
  color: inherit;
  background: transparent;
  margin-top: 1em;
  border: 0;
  border-bottom: 1px dotted #eee;
}

ul {
  list-style-type: none;
  padding: 0;

  li {
    a {
      display: block;
      padding: 1em 0;
    }

    &.completed {
      text-decoration: line-through;
    }
  }
}
</style>
