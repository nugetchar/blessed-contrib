var blessed = require('blessed')
  , contrib = require('../index')

var screen = blessed.screen()

//create layout and widgets

var grid = new contrib.grid({rows: 12, cols: 12})

grid.set(8, 8, 4, 2, contrib.line, 
  { style: 
    { line: "yellow"
    , text: "green"
    , baseline: "black"}
  , xLabelPadding: 3
  , xPadding: 5
  , label: 'Network Latency (sec)'})

grid.set(8, 10, 2, 2, contrib.gauge, {label: 'Deployment Progress'})

grid.set(10, 10, 2, 2, contrib.sparkline, 
  { label: 'Throughput (bits/sec)'
  , tags: true
  , style: { fg: 'blue', titleFg: 'white' }})

grid.set(4, 6, 4, 3, contrib.bar, 
  { label: 'Server Utilization (%)'
  , barWidth: 4
  , barSpacing: 6
  , xOffset: 2
  , maxHeight: 9})

grid.set(4, 9, 4, 3, contrib.table, 
  { keys: true
  , fg: 'green'
  , label: 'Active Processes'
  , columnSpacing: 1
  , columnWidth: [24, 10, 10]})

grid.set(0, 6, 4, 6, contrib.line, 
  { style: 
    { line: "red"
    , text: "white"
    , baseline: "black"}
  , label: 'Errors Rate'
  , maxY: 60
  , showLegend: true})

grid.set(0, 0, 6, 6, contrib.line, 
  { showNthLabel: 5
  , maxY: 100
  , label: 'Total Transactions'
  , showLegend: true})

grid.set(6, 0, 6, 6, contrib.map, {label: 'Servers Location'})

grid.set(8, 6, 4, 2, contrib.log, 
  { fg: "green"
  , selectedFg: "green"
  , label: 'Server Log'})

grid.applyLayout(screen)

var transactionsLine = grid.get(0, 0)
var errorsLine = grid.get(0, 6)
var latencyLine = grid.get(8, 8)
var map = grid.get(6, 0)
var log = grid.get(8, 6)
var table = grid.get(4, 9)
var sparkline = grid.get(10, 10)
var gauge = grid.get(8, 10)
var bar = grid.get(4, 6)


//dummy data
var servers = ['US1', 'US2', 'EU1', 'AU1', 'AS1', 'JP1']
var commands = ['grep', 'node', 'java', 'timer', '~/ls -l', 'netns', 'watchdog', 'gulp', 'tar -xvf', 'awk', 'npm install']


//set dummy data on gauge
var gauge_percent = 0
setInterval(function() {
  gauge.setPercent(gauge_percent++)  
  if (gauge_percent>100) gauge_percent = 0  
}, 200)


//set dummy data on bar chart
function fillBar() {
  var arr = []
  for (var i=0; i<servers.length; i++) {
    arr.push(Math.round(Math.random()*10))
  }
  bar.setData({titles: servers, data: arr})
}
fillBar()
setInterval(fillBar, 2000)


//set dummy data for table
function generateTable() {
   var data = []

   for (var i=0; i<30; i++) {
     var row = []          
     row.push(commands[Math.round(Math.random()*(commands.length-1))])
     row.push(Math.round(Math.random()*5))
     row.push(Math.round(Math.random()*100))

     data.push(row)
   }

   table.setData({headers: ['Process', 'Cpu (%)', 'Memory'], data: data})
}

generateTable()
table.focus()
setInterval(generateTable, 3000)


//set log dummy data
setInterval(function() {
   var rnd = Math.round(Math.random()*2)
   if (rnd==0) log.log('starting process ' + commands[Math.round(Math.random()*(commands.length-1))])   
   else if (rnd==1) log.log('terminating server ' + servers[Math.round(Math.random()*(servers.length-1))])
   else if (rnd==2) log.log('avg. wait time ' + Math.random().toFixed(2))
   screen.render()
}, 500)


//set spark dummy data
var spark1 = [1,2,5,2,1,5,1,2,5,2,1,5,4,4,5,4,1,5,1,2,5,2,1,5,1,2,5,2,1,5,1,2,5,2,1,5]
var spark2 = [4,4,5,4,1,5,1,2,5,2,1,5,4,4,5,4,1,5,1,2,5,2,1,5,1,2,5,2,1,5,1,2,5,2,1,5]

refreshSpark()
setInterval(refreshSpark, 1000)

function refreshSpark() {
  spark1.shift()
  spark1.push(Math.random()*5+1)       
  spark2.shift()
  spark2.push(Math.random()*5+1)       
  sparkline.setData(['Server1', 'Server2'], [spark1, spark2])  
}



//set map dummy markers
var marker = true
setInterval(function() {
   if (marker) {
    map.addMarker({"lon" : "-79.0000", "lat" : "37.5000", color: 'yellow', char: 'X' })
    map.addMarker({"lon" : "-122.6819", "lat" : "45.5200" })
    map.addMarker({"lon" : "-6.2597", "lat" : "53.3478" })
    map.addMarker({"lon" : "103.8000", "lat" : "1.3000" })
   }
   else {
    map.clearMarkers()
   }
   marker =! marker
   screen.render()
}, 1000)




//set line charts dummy data

var transactionsData = {
   title: 'server 1',
   x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:30', '00:40', '00:50', '01:00', '01:10', '01:20', '01:30', '01:40', '01:50', '02:00', '02:10', '02:20', '02:30', '02:40', '02:50', '03:00', '03:10', '03:20', '03:30', '03:40', '03:50', '04:00', '04:10', '04:20', '04:30'],
   y: [0, 10, 40, 45, 45, 50, 55, 70, 65, 58, 50, 55, 60, 65, 70, 80, 70, 50, 40, 50, 60, 70, 82, 88, 89, 89, 89, 80, 72, 70]
}

var errorsData = {
   title: 'server 1',
   x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:25'],
   y: [30, 50, 70, 40, 50, 20]
}

var latencyData = {
   x: ['t1', 't2', 't3', 't4'],
   y: [5, 1, 7, 5]
}

setLineData(transactionsData, transactionsLine)
setLineData(errorsData, errorsLine)
setLineData(latencyData, latencyLine)

setInterval(function() {
   setLineData(transactionsData, transactionsLine)
   screen.render()
}, 500)

setInterval(function() {   
   setLineData(errorsData, errorsLine)
   screen.render()
}, 1500)

setInterval(function() {   
   setLineData(latencyData, latencyLine)
   screen.render()
}, 5000)

function setLineData(mockData, line) {
  var last = mockData.y[mockData.y.length-1]
  mockData.y.shift()
  var num = Math.max(last + Math.round(Math.random()*10) - 5, 10)    
  mockData.y.push(num)     
  line.setData([mockData])
}


screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render()
