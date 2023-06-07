function formatTime() {
	let date = new Date();
	let year = date.getFullYear();
	let month = zero(date.getMonth() + 1);
	let day = zero(date.getDate());
	let hh = zero(date.getHours());
	let mm = zero(date.getMinutes());
	let ss = zero(date.getSeconds());
	return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
}

function zero(num) {
	if (Number(num) < 10) {
		return '0' + num
	} else {
		return num
	}
}

function formatTodayDate() {
	let date = new Date();
	let year = date.getFullYear();
	let month = zero(date.getMonth() + 1);
	let day = zero(date.getDate());
	return year + "-" + month + "-" + day;
}

function formatTodayDateDay() {
	let date = new Date();
	let year = date.getFullYear();
	let month = zero(date.getMonth() + 1);
	let day = zero(date.getDate());
	let hour = zero(date.getHours())
	let minute = zero(date.getMinutes())
	let second = zero(date.getSeconds())
	return year + "-" + month + "-" + day + ' ' + hour + ':' + minute + ':' + second;
}

function formatTommorowFiveDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() + 3);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}



function formatOldDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 1);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}

function formatOldTwoDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 2);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}
function formatTommorowDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() + 1);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}

function formatThirdDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 3);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}

function formatFivthDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 15);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}

function formatSevenDate() {
	let date = new Date();
	let newDate = date.setDate(date.getDate() - 7);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}


function formatMonthDate() {
	let date = new Date();
	let newDate = date.setMonth(date.getMonth() + 1);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}
function formatLastMonthDate() {
	let date = new Date();
	let newDate = date.setMonth(date.getMonth() - 1);
	newDate = new Date(newDate)
	let year = newDate.getFullYear();
	let month = zero(newDate.getMonth() + 1);
	let day = zero(newDate.getDate());
	return year + "-" + month + "-" + day;
}

export default {
	formatTodayDate,
	formatOldDate,
	formatTommorowDate,
	formatOldTwoDate,
	formatThirdDate,
	formatFivthDate,
	formatSevenDate,
	formatMonthDate,
	formatTime,
	formatLastMonthDate,
	formatTommorowFiveDate,
	formatTodayDateDay
}
