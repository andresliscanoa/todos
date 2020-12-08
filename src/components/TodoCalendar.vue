<template>
  <v-layout justify-center row wrap>
    <v-flex xs12>
      <v-sheet height="64">

        <v-toolbar
            flat
        >
          <v-btn
              class="mr-4"
              color="grey darken-2"
              outlined
              @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
              color="grey darken-2"
              fab
              small
              text
              @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
              color="grey darken-2"
              fab
              small
              text
              @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
              bottom
              right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  v-bind="attrs"
                  v-on="on"
                  color="grey darken-2"
                  outlined
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
    </v-flex>
    <v-flex xs12>
      <v-sheet height="600">
        <v-calendar
            ref="calendar"
            v-model="focus"
            :event-color="getEventColor"
            :events="events"
            :type="type"
            color="primary"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
        ></v-calendar>
        <v-menu
            v-model="selectedOpen"
            :activator="selectedElement"
            :close-on-content-click="false"
            offset-x
        >
          <v-card
              color="grey lighten-4"
              flat
              min-width="350px"
          >
            <v-toolbar
                :color="selectedEvent.color"
                dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  color="secondary"
                  text
                  @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name   : 'TodoCalendar',
  data   : () => ({
    focus          : '',
    type           : 'month',
    typeToLabel    : {
      month: 'Month',
      week : 'Week',
      day  : 'Day'
    },
    selectedEvent  : {},
    selectedElement: null,
    selectedOpen   : false
  }),
  computed: {
    ...mapGetters( [ 'getTodosCalendar' ] ),
    events() { return this.getTodosCalendar }
  },
  methods: {
    viewDay( { date } ) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor( event ) {
      return event.color
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent( { nativeEvent, event } ) {
      this.$emit( 'openTodoDialogShow', event )
      nativeEvent.stopPropagation()
    }
  }
}
</script>
