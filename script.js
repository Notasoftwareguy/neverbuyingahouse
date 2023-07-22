
var house_void = [0];
var house_money = [0];
var house_savings = [0];

var rent_void = [0];
var rent_savings = [0];


function calculate() {
    let house_cost = parseFloat(document.getElementById("house_cost").value);
    let down_payment = parseFloat(document.getElementById("down_payment").value);
    let loan_length = parseFloat(document.getElementById("loan_length").value);
    let loan_apr = parseFloat(document.getElementById("loan_apr").value);
    let yearly_fixed_costs = parseFloat(document.getElementById("yearly_fixed_costs").value);
    
    var num_payments = loan_length*12;
    var monthly_interest = loan_apr/12/100;
    var monthly_fixed_costs = yearly_fixed_costs/12;
    var temp = (1+monthly_interest)**num_payments;
    var mortgage = (house_cost-down_payment) * monthly_interest * temp / (temp-1);
    var monthly_house_cost = mortgage + monthly_fixed_costs;

    var yearly_house_cost = monthly_house_cost*12;
    var yearly_house_void = yearly_house_cost- (house_cost-down_payment)/loan_length;
    var yearly_house = yearly_house_cost-yearly_house_void;

    let rent = parseFloat(document.getElementById("rent").value);
    let savings_interest = parseFloat(document.getElementById("savings_interest").value);
    
    var yearly_rent_saving = yearly_house_cost - rent*12;

    house_void = [0];
    house_money = [down_payment];
    house_savings = [0];

    rent_void = [0];
    rent_savings = [down_payment];

    for (let i=1; i<51; i++) {
        if (house_money[i-1] >= house_cost) {
            house_void[i] = house_void[i-1] + yearly_fixed_costs;
            house_money[i] = house_money[i-1];
            house_savings[i] = (house_savings[i-1] + yearly_house_cost - yearly_fixed_costs)*(1+savings_interest/100); 
        }
        else {
            house_void[i] = house_void[i-1] + yearly_house_void;
            house_money[i] = house_money[i-1] + yearly_house;
            house_savings[i] = 0;
        }

        rent_void[i] = rent_void[i-1] + rent*12;
        rent_savings[i] = (rent_savings[i-1] + yearly_rent_saving)*(1+savings_interest/100);
    }

    drawSavingsChart();
    drawVoidChart();

    let rent_saving = Math.round(monthly_house_cost-rent);
    document.getElementById("monthly_house").innerHTML = ('Monthly house cost: $'+Math.round(monthly_house_cost));
    document.getElementById("monthly_rent_savings").innerHTML = ('Monthly rent saving: $'+rent_saving);
}



function drawSavingsChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Year');
    data.addColumn('number', 'House Savings');
    data.addColumn('number', 'Rent Savings');

    for (i=0; i<rent_void.length; i++) {
        data.addRows([[i, house_savings[i]+house_money[i], rent_savings[i]]])
    }

    var options = {
        title: 'Savings Comparison',
        legend: { position: 'top' },
        hAxis: {title: 'Years', ticks: [0,5,10,15,20,25,30,35,40,45,50]},
        backgroundColor: 'whitesmoke'
      };

    var chart = new google.visualization.LineChart(document.getElementById("savings_chart"));
    chart.draw(data, options);
  }

function drawVoidChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Year');
    data.addColumn('number', 'House Void');
    data.addColumn('number', 'Rent Void');

    for (i=0; i<rent_void.length; i++) {
        data.addRows([[i, house_void[i], rent_void[i]]])
    }

    var options = {
        title: 'Void Comparison',
        legend: { position: 'top' },
        hAxis: {title: 'Years', ticks: [0,5,10,15,20,25,30,35,40,45,50]},
        backgroundColor: 'whitesmoke'
      };

    var chart = new google.visualization.LineChart(document.getElementById("void_chart"));
    chart.draw(data, options);
  }