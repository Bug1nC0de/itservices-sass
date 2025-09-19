import { useEffect, useState } from 'react';
import moment from 'moment';

const TheTimer = ({ deadline, prevTodo }) => {
  const [howMuchTime, setHowMuchTime] = useState();
  let type = deadline.type;
  let time = deadline.deadline;
  let rightNow = moment().format();
  useEffect(() => {
    if (type === 'Once') {
      let mustBeDone = deadline.deadline;
      let whatsTheDiff = moment(mustBeDone).diff(moment(rightNow), 'h');

      if (whatsTheDiff >= 24) {
        let whatsTheDays = parseInt(whatsTheDiff / 24);
        let daysLeft = `${whatsTheDays} day/s to go`;
        setHowMuchTime(daysLeft);
      } else if (whatsTheDiff > 0) {
        let whatsTheHours = parseInt(whatsTheDiff);
        let hoursLeft = `${whatsTheHours} hour/s to go`;
        setHowMuchTime(hoursLeft);
      } else {
        console.log('We running late');
      }
    } else if (type === 'Daily') {
      if (prevTodo === null) {
        let setTime = time.split(':').shift();
        let daily = moment().set({ hour: parseInt(setTime), minute: 0 });
        let dailyDate = daily.format();
        if (dailyDate > rightNow) {
          const stillHours = moment(dailyDate).diff(moment(rightNow), 'hour');
          if (stillHours > 1) {
            let time = `${stillHours} hour/s to go`;
            setHowMuchTime(time);
          } else {
            const stillMins = moment(dailyDate).diff(
              moment(rightNow),
              'minute'
            );
            let time = `${stillMins} minute/s to go`;
            setHowMuchTime(time);
          }
        } else {
          const hoursLate = moment(dailyDate).diff(moment(rightNow), 'hour');
          if (hoursLate <= -1) {
            let shift = hoursLate.toString();
            let pop = shift.split('-').pop();
            let time = `${pop} hours late`;
            setHowMuchTime(time);
          } else {
            const minsLate = moment(dailyDate).diff(moment(rightNow), 'minute');
            let shift = minsLate.toString();
            let pop = shift.split('-').pop();
            let time = `${pop} minutes late`;
            setHowMuchTime(time);
          }
        }
      } else {
        let setTime = time.split(':').shift();
        let daily = moment().set({ hour: parseInt(setTime), minute: 0 });
        let dailyDate = daily.format();
        let completedAt = prevTodo.completedAt;
        let dueDate = moment(completedAt).add(1, 'd');
        let whatsTheDiff = moment(dailyDate).diff(moment(dueDate), 'hour');
        if (whatsTheDiff > 24) {
          let howManyDays = parseInt(whatsTheDiff / 24);
          let daysLate = `${howManyDays} day/s late`;
          setHowMuchTime(daysLate);
        } else if (whatsTheDiff >= 1) {
          let howManyHours = parseInt(whatsTheDiff);
          let hoursLate = `${howManyHours} hour/s late`;
          setHowMuchTime(hoursLate);
        } else {
          let shift = whatsTheDiff.toString();
          let pop = shift.split('-').pop();
          let hoursEarly = `${pop} hour/s to go`;
          setHowMuchTime(hoursEarly);
        }
      }
    } else if (type === 'Weekly') {
      if (prevTodo === null) {
        let whichDay = deadline.deadline;

        const findTheDay = (whichDay) => {
          if (whichDay === 'Monday') {
            let line = moment()
              .weekday(1)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Tuesday') {
            let line = moment()
              .weekday(2)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Wednesday') {
            let line = moment()
              .weekday(3)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Thursday') {
            let line = moment()
              .weekday(4)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Friday') {
            let line = moment()
              .weekday(5)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Saturday') {
            let line = moment()
              .weekday(6)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Sunday') {
            let line = moment()
              .weekday(7)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          }
        };

        let redLine = findTheDay(whichDay);

        const whatsTheDiff = moment(rightNow).diff(moment(redLine), 'h');
        if (whatsTheDiff > 24) {
          let howManyDays = parseInt(whatsTheDiff / 24);
          let daysLate = ` ${howManyDays} day/s late`;
          setHowMuchTime(daysLate);
        } else if (whatsTheDiff >= 1) {
          let howManyHours = parseInt(whatsTheDiff);
          let hoursLate = ` ${howManyHours} hour/s late`;
          setHowMuchTime(hoursLate);
        } else if (whatsTheDiff < 0) {
          let shift = whatsTheDiff.toString();
          let pop = shift.split('-').pop();
          if (pop > 24) {
            let howManyDays = parseInt(pop / 24);
            let daysEarly = ` ${howManyDays} day/s early`;
            setHowMuchTime(daysEarly);
          } else if (pop >= 1) {
            let howManyHours = parseInt(pop);
            let hoursEarly = ` ${howManyHours} hour/s early`;
            setHowMuchTime(hoursEarly);
          }
        }
      } else {
        let whichDay = deadline.deadline;

        const findTheDay = (whichDay) => {
          if (whichDay === 'Monday') {
            let line = moment()
              .weekday(1)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Tuesday') {
            let line = moment()
              .weekday(2)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Wednesday') {
            let line = moment()
              .weekday(3)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Thursday') {
            let line = moment()
              .weekday(4)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Friday') {
            let line = moment()
              .weekday(5)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Saturday') {
            let line = moment()
              .weekday(6)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          } else if (whichDay === 'Sunday') {
            let line = moment()
              .weekday(7)
              .set({ hour: 12, minute: 0, second: 0 });
            return line;
          }
        };

        let redLine = findTheDay(whichDay);

        const whatsTheDiff = moment(rightNow).diff(moment(redLine), 'h');
        if (whatsTheDiff > 24) {
          let howManyDays = parseInt(whatsTheDiff / 24);
          let daysLate = ` ${howManyDays} day/s late`;
          setHowMuchTime(daysLate);
        } else if (whatsTheDiff >= 1) {
          let howManyHours = parseInt(whatsTheDiff);
          let hoursLate = ` ${howManyHours} hour/s late`;
          setHowMuchTime(hoursLate);
        } else if (whatsTheDiff < 0) {
          let shift = whatsTheDiff.toString();
          let pop = shift.split('-').pop();
          if (pop > 24) {
            let howManyDays = parseInt(pop / 24);
            let daysEarly = ` ${howManyDays} day/s to go`;
            setHowMuchTime(daysEarly);
          } else if (pop >= 1) {
            let howManyHours = parseInt(pop);
            let hoursEarly = ` ${howManyHours} hour/s to go`;
            setHowMuchTime(hoursEarly);
          }
        }
      }
    } else if (type === 'Monthly') {
      if (prevTodo === null) {
        let monthlyDeadline = moment().set({
          date: parseInt(deadline.deadline),
          hour: 17,
          minute: 0,
          second: 0,
        });

        let whatsTheDiff = monthlyDeadline.diff(moment(rightNow), 'h');
        if (whatsTheDiff > 24) {
          let howManyDays = parseInt(whatsTheDiff / 24);
          let daysLeft = `${howManyDays} day/s to go`;
          setHowMuchTime(daysLeft);
        } else if (whatsTheDiff <= 24 && whatsTheDiff > 0) {
          let howManyHours = parseInt(whatsTheDiff);
          let hoursLeft = `${howManyHours} hour/s to go`;
          setHowMuchTime(hoursLeft);
        } else {
          let shift = whatsTheDiff.toString();
          let pop = shift.split('-').pop();
          if (pop > 24) {
            let howManyDays = parseInt(pop / 24);
            let daylsLate = ` ${howManyDays} day/s late`;
            setHowMuchTime(daylsLate);
          } else {
            let howManyHours = parseInt(pop);
            let hoursLate = ` ${howManyHours} hour/s late`;
            setHowMuchTime(hoursLate);
          }
        }
      } else {
        let monthlyDeadline = moment().set({
          date: parseInt(deadline.deadline),
          hour: 17,
          minute: 0,
          second: 0,
        });
        let prevTodoMonthComplete = moment(prevTodo.completedAt).format('MMMM');

        let monthToBeDone = moment(monthlyDeadline).format('MMMM');

        if (prevTodoMonthComplete === monthToBeDone) {
          let nextMonth = monthlyDeadline.add({ month: 1 });
          let whatsTheDiff = moment(rightNow).diff(nextMonth, 'd');
          let shift = whatsTheDiff.toString();
          let pop = shift.split('-').pop();
          let howManyDays = `${pop} days/s to go`;
          setHowMuchTime(howManyDays);
        } else {
          let whatsTheDiff = monthlyDeadline.diff(moment(rightNow), 'h');
          if (whatsTheDiff > 24) {
            let pop = parseInt(whatsTheDiff / 24);
            let howManyDays = `${pop} days/s to go`;
            setHowMuchTime(howManyDays);
          } else if (whatsTheDiff) {
            let pop = parseInt(whatsTheDiff);
            let howManyHours = `${pop} hour/s to go`;
            setHowMuchTime(howManyHours);
          }
        }
      }
    }
  }, [type, time, rightNow, prevTodo, deadline]);

  return (
    <>
      {type === 'Once'
        ? ''
        : type === 'Daily'
        ? `${howMuchTime}`
        : type === 'Weekly'
        ? `${howMuchTime}`
        : type === 'Monthly' && `${howMuchTime}`}
    </>
  );
};

export default TheTimer;
