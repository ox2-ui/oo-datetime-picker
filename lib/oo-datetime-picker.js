//- Component params -
//- year: number, month=string(Jan,Feb..), day: number, hour: number(24), mintute: number
//- type: datetime || time || date
//- collection, docId, value, field,
//- activeWidget: 'time' or nothing
//- timeZone: if that not found falls back to local tz

// used to hack time zone string
getTimeFormatedInISO = function (curTime) {
  var timeString = curTime.format('YYYY-MM-DD HH:mm')
  return moment.tz(timeString, Session.get('timeZone')).format();
  // return curTime.toISOString();
}

Template.ooDatetimePicker.created = function () {
  var self = this;
  oo.log('gray', `this`, this);
  // If VALUE is passed plit it into PARTS
  // 	OR
  // If PARTS are passed use them, otherwise use current time
  if (self.data) {
      if (self.data.type !== 'date') {

        self.ooAMPM = new Blaze.ReactiveVar(
          self.data.value ? moment.tz(self.data.value, self.data.timeZone).format('A') : (
            self.data.hour ? (self.data.hour > 11 ? 'PM' : 'AM') : 'AM'
          ));
        self.ooMinutes = new Blaze.ReactiveVar(
          self.data.value ? moment.tz(self.data.value, self.data.timeZone).minute() : (
            self.data.minutes ? self.data.minutes : ''
          ));
        self.ooHours = new Blaze.ReactiveVar(
          self.data.value ? parseInt(moment.tz(self.data.value, self.data.timeZone).format('h')) : (
            self.data.hour ? self.data.hour : ''
          ));
      }
      if (self.data.type !== 'time') {
        self.ooDay = new Blaze.ReactiveVar(
          self.data.value ? moment.tz(self.data.value, self.data.timeZone).date() : (
            self.data.day ? ((self.data.day.indexOf('now') !== -1) ? moment().date() : self.data.day) : ''
          ));
        self.ooMonth = new Blaze.ReactiveVar(
          self.data.value ? moment.tz(self.data.value, self.data.timeZone).format('MMM') : (
            self.data.month ? ((self.data.month.indexOf('now') !== -1) ? moment().format('MMM') : self.data.month) : ''
          ));
        self.ooYear = new Blaze.ReactiveVar(
          self.data.value ? moment.tz(self.data.value, self.data.timeZone).year() : (
            self.data.year ? ((self.data.year.indexOf('now') !== -1) ? moment().year() : self.data.year) : ''
          ));

        if (self.data.duration) {
          self.durationMinutes = new Blaze.ReactiveVar(30);
          self.durationHours = new Blaze.ReactiveVar(0);
        }
        self.duration = self.data.duration;
      }

      self.oldValue = new Blaze.ReactiveVar(self.data.value ? moment(self.data.value) : false);
      self.newValue = new Blaze.ReactiveVar();
    } else {
      console.log('%c Error: no params passed on ooDatetimePicker created',  'background: #BD4F7A; color: white; padding: 1px 15px 1px 5px;');
  }






    self.currentMonthDays = new Blaze.ReactiveVar([])
    self.activeWidget = new Blaze.ReactiveVar(self.data.activeWidget ? self.data.activeWidget + 'Widget' : 'dayWidget');
    self.activeField = new Blaze.ReactiveVar('Primary')


// need as it fails otherwise
  self.autorun(function() {
    if (self.data.duration) {
      if (!self.ooYear.get()) {
        self.activeWidget.set('yearWidget');
      } else if (!self.ooMonth.get()) {
        self.activeWidget.set('monthWidget');
      } else if (!self.ooDay.get()) {
        self.activeWidget.set('dayKeywordWidget');
      } else if (!self.ooHours.get()) {
        self.activeWidget.set('hourWidget');
      } else if (!self.ooMinutes.get()) {
        self.activeWidget.set('minuteWidget');
      }
    } else {
      if (self.data.type !== 'time') {
        if (!self.ooYear.get()) {
          self.activeWidget.set('yearWidget');
        } else if (!self.ooMonth.get()) {
          self.activeWidget.set('monthWidget');
        } else if (!self.ooDay.get()) {
          self.activeWidget.set('dayWidget');
        } else if (!self.ooHours.get() && self.data.type !== 'date') {
          self.activeWidget.set('hourWidget');
        } else if (!self.ooMinutes.get() && self.data.type !== 'date') {
          self.activeWidget.set('minuteWidget');
        }
      } else {
        self.activeWidget.set('hourWidget');
      }
    }
  })


  self.autorun(function() {
    var newValue = moment(self.ooYear.get() + ' ' + self.ooMonth.get() + ' ' + self.ooDay.get() + ' ' + self.ooHours.get() + ':' + self.ooMinutes.get() + ' ' + self.ooAMPM.get(), 'YYYY MMM D h:m A')
    if (newValue.isValid()) {
      self.newValue.set(newValue)
    } else {
      self.newValue.set()
      console.log('failed to construct datetime', newValue)
    }
  })

//
//      Time picker component
//


//
//      Date picker component
//


  // Check if month changes reactively and set new dates array
  self.autorun(function() {
    if (self.type !== 'time') {
      if (self.ooMonth.get()) {
        var DaysArray = [];
        var selectedMonthData = moment(self.ooYear.get() + ' ' + self.ooMonth.get(), 'YYYY MMM')
        var firstDay = selectedMonthData.day()
        var totalDays = selectedMonthData.daysInMonth();
        for (var i =0; i < firstDay; i++) {
          DaysArray.push(0)
        }

        for (var j = 1; j <= totalDays; j++) {
          DaysArray.push(j)
        }

        var missingDays = 35 - DaysArray.length
        if (missingDays) {
          for (var k =0; k < missingDays; k++) {
            DaysArray.push(0)
          }
        }

        self.currentMonthDays.set(DaysArray)
      }

    }
  });


  //
  //      Month picker component
  //


  //
  //      Year picker component
  //

};

Template.ooDatetimePicker.helpers({
  pickerContext: function() {
    return this;
  },
  pickerType: function(params) {
    var type = this.type ? this.type : 'datetime'
    return (type.indexOf(params) !== -1) ? true : false
  },
  timeCorrect: function() {
    return Template.instance().newValue.get()
  },
  activeWidget: function(params) {
    return params === Template.instance().activeWidget.get() ? true : false;
  },
  //
  //      minute helpers
  //
  minutes: function() {
    return _.range(0, 60, 5)
  },
  ifActiveMinute: function () {
    return this.valueOf() === Template.instance().ooMinutes.get() ? "is-active" : "";
  },
  activeMinute : function () {
    var setMinute = Template.instance().ooMinutes.get()
    return typeof setMinute === 'number' ? (setMinute < 10 ? '0' + setMinute : setMinute) : '--'
  },
  //
  //      hour helpers
  //
  hours: function() {
    return _.range(1, 13)
  },
  ifActiveHour: function () {
    return this.valueOf() === Template.instance().ooHours.get() ? "is-active" : "";
  },
  activeHour : function () {
    var setHour = Template.instance().ooHours.get()
    return typeof setHour === 'number' ? (setHour < 10 ? '0' + setHour : setHour ) : '--'
  },
  ifActiveAMPM: function (params) {
    return params == Template.instance().ooAMPM.get() ? "action" : "";
  },
  //
  //      day helpers
  //
  weekdays: function() {
    return ['S','M','T','W','T','F','S']
  },
  activeDay : function () {
   return Template.instance().ooDay.get()
  },
  currentDays: function() {
    return Template.instance().currentMonthDays.get();
  },
  ifActiveDay: function () {
    return this.valueOf() === Template.instance().ooDay.get() ? "is-active" : "";
  },
  calendarMonth: function() {
    return moment(Template.instance().ooMonth.get(), 'MMM').format('MMMM')
  },
  durationHours : function () {
   return Template.instance().durationHours.get();
   // return Template.instance().duration.get().hours();
  },
  durationHoursPlural : function () {
   return Template.instance().durationHours.get() === 1 ? 'hour' : 'hours';
  },
  durationMinutes : function () {
   return Template.instance().durationMinutes.get();
   return Template.instance().duration.get().minutes();
  },
  durationHumanized : function () {
   return Template.instance().duration.get().humanize();
  },
  activeWeekDay: function() {
    var day = Template.instance().ooDay.get();
    var month = Template.instance().ooMonth.get();
    var year = Template.instance().ooYear.get();
    return day && month && year ? moment(year + ' ' + month + ' ' + day, 'YYYY MMM D').format('dddd') : '-'
  },
  activeCalendarDay: function() {
    var day = Template.instance().ooDay.get();
    var month = Template.instance().ooMonth.get();
    var year = Template.instance().ooYear.get();
    var hours = Template.instance().ooHours.get();
    var minutes = Template.instance().ooMinutes.get();
    var ampm = Template.instance().ooAMPM.get();
    var calendarDay = '-';
    if (day && month && year && hours && minutes && ampm ) {
      var date = moment(year + ' ' + month + ' ' + day + ' ' + hours + ':' + minutes + ' ' + ampm, 'YYYY MMM D h:m A')
      if (date.isBefore(moment().add(6, 'days'))) {
        calendarDay = date.calendar(null, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] dddd'
        })
      } else {
        calendarDay = date.fromNow();
      }
    }

    return calendarDay;
  },
  //
  //      month helpers
  //
  months: function() {
    return  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  },
  ifActiveMonth: function () {
    return this.valueOf() === Template.instance().ooMonth.get() ? "is-active" : "";
  },
  activeMonth : function () {
   return Template.instance().ooMonth.get()
  },
  //
  //      year helpers
  //
  years: function() {
    var yearSelected = moment().year();
    return  [yearSelected, yearSelected+1, yearSelected+ 2, yearSelected+3, yearSelected+4, yearSelected+5, yearSelected+6, yearSelected+7, yearSelected+8, yearSelected+9, yearSelected+10,yearSelected+11];
  },
  ifActiveYear: function () {
    return this.valueOf() === Template.instance().ooYear.get() ? "is-active" : "";
  },
  activeYear : function () {
   return Template.instance().ooYear.get();
  }
});

Template.ooDatetimePicker.events({
  'click .js-cancel': function(e, t) {
    dateSelectModalHide(function (res) {
      if (res) {
        Session.set('DateSelectModal', false);
      }
    });
  },
  'click .js-closeAndSave': function(e, t) {
    var self = this;
    var query = {};
    query[self.field] = getTimeFormatedInISO(t.newValue.get());

    Collection[self.collection].update({_id: self.docId}, {$set: query}, function(err, res) {
      if (err) {
        console.log(err);
      }
    });
    dateSelectModalHide(function (res) {
      if (res) {
        Session.set('DateSelectModal', false);
      }
    });
  },
  'click .js-openYearWidget': function(e, t) {
    t.activeWidget.set('yearWidget')
  },
  'click .js-openMonthWidget': function(e, t) {
    t.activeWidget.set('monthWidget')
  },
  'click .js-openDayWidget': function(e, t) {
    if (t.ooMonth.get())
      t.activeWidget.set('dayWidget')
    else
      t.activeWidget.set('monthWidget')
  },
  'click .js-openHourWidget': function(e, t) {
    t.activeWidget.set('hourWidget')
  },
  'click .js-openMinuteWidget': function(e, t) {
    t.activeWidget.set('minuteWidget')
  },
  'click .js-openDurationWidget': function(e, t) {
    t.activeWidget.set('durationWidget')
  },
  'click .js-dayKeywordWidget': function(e, t) {
    t.activeWidget.set('dayKeywordWidget')
  },

  //
  //      minutes
  //
  'click .js-selectMinute' : function (e, t) {
    t.ooMinutes.set(this.valueOf());
    if (t.duration) {
      t.activeWidget.set('durationWidget');
    }
  },
  'click .js-inreaseMinute': function(e, t) {
    var currentM = t.ooMinutes.get()
    if ( currentM == 59)
      t.ooMinutes.set(0)
    else
      t.ooMinutes.set(currentM + 1)
  },
  'click .js-decreaseMinute': function(e, t) {
    var currentM = t.ooMinutes.get()
    if ( currentM == 0)
      t.ooMinutes.set(59)
    else
      t.ooMinutes.set(currentM - 1)
  },
  //
  //      hours
  //
  'click .js-setPm': function(e, t) {
    t.ooAMPM.set('PM')
  },
  'click .js-setAM': function(e, t) {
    t.ooAMPM.set('AM')
  },
  'click .js-selectHour' : function (e, t) {
    t.ooHours.set(this.valueOf());
    t.activeWidget.set('minuteWidget');

  },
  //
  //      day
  //

  'click .js-selectDay' : function (e, t) {
    t.ooDay.set(this.valueOf())

  },

  //
  //      month
  //
  'click .js-selectMonth' : function (e, t) {
    if (t.ooDay.get() && (t.ooDay.get() > moment(t.ooYear.get() + ' ' + this.valueOf(), 'YYYY MMM').daysInMonth())) {
      t.ooDay.set('')
    }
    t.ooMonth.set(this.valueOf())

  },
  //
  //      year
  //
  'click .js-selectYear' : function (e, t) {
    t.ooDay.set('')
    t.ooMonth.set('')
    t.ooYear.set(this.valueOf())

  },
  //
  //      Date Keywords
  //
  'click .js-setToday' : function (e, t) {
    var date = moment();
    t.ooDay.set(date.format('D'))
    t.ooMonth.set(date.format('MMM'))
    t.ooYear.set(date.format('YYYY'))

  },
  'click .js-setTommorow' : function (e, t) {
    var date = moment().add(1, 'd');
    t.ooDay.set(date.format('D'))
    t.ooMonth.set(date.format('MMM'))
    t.ooYear.set(date.format('YYYY'))
  },
  //
  //      Duration Controls
  //
  'click .js-durationHourPlus' : function (e, t) {
    var inc = t.durationHours.get() + 1;
    t.durationHours.set(inc === 13 ? 0 : inc)
  },
  'click .js-durationHourMinus' : function (e, t) {
    var inc = t.durationHours.get() - 1;
    t.durationHours.set(inc === -1 ? 12 : inc)
  },
  'click .js-durationMinutePlus' : function (e, t) {
    var inc = t.durationMinutes.get() + 5;
    t.durationMinutes.set(inc === 60 ? 0 : inc)
  },
  'click .js-durationMinuteMinus' : function (e, t) {
    var inc = t.durationMinutes.get() - 5;
    t.durationMinutes.set(inc === -5 ? 55 : inc)
  },
});
