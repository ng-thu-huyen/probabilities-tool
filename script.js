// CPP

const cpSubmitOnClick = () => { 
    var n = document.getElementById("cp_count").value;
    var type_1 = document.getElementById("type_1").checked;
    var type_2 = document.getElementById("type_2").checked;
    var p_lst = document.getElementById("cp_prob").value
                        .split("\n");
    if (!cpValidateInput(n, type_1, type_2, p_lst)) return;
    if (type_1) cpCalType1(n);
        
    else cpCalType2 (p_lst);
  
}

function cpValidateInput (n, type_1, type_2, p_lst) {
    var err = "";
    if (n == "") err += "Error: number of coupon types is empty\n";
    if (!(type_1 | type_2)) err += "Error: problem type unselected \n";
    if (type_1) {
        if (p_lst.length < 1) err += "Error: coupon probability is empty \n";
        if (p_lst.length > 1) err += "Error: more than one input\n";
        else {
            var p = p_lst[0];
            try {
                eval(p);
            }
            catch (e) {
                err +=  "Error: input for probability is not a number \n";
                alert(err);
                return;
            }
            p = parseFloat(eval(p));
            if (p <= 0 || p > 1) {
                err += "Error: probability must be larger than 0 and less than 1 \n";
                alert(err);
                return;
            }
            var sum = p * n;
            if (sum.toFixed(10)!= 1) {
                err += "Error: sum of coupon probability is not 1 \n";
                alert(err);
                return;
            }
            p_lst[0] = p;
        }
    }
    if (type_2) {
        var sum = 0;
        for (var i = 0; i < p_lst.length; i ++) {
            var p = p_lst[i];
            try {
                eval(p);
            }
            catch (e) {
                err +=  "Error: input for probability is not a number \n";
                alert(err);
                return;
            }
            p = parseFloat(eval(p));
            if (p <= 0 || p > 1) {
                err += "Error: probability must be larger than 0 and less than 1 \n";
                alert(err);
                return;
            }
            p_lst[i] = p;
            sum += p;
        }
        if (sum.toFixed(10) != 1) {
            err += "Error: sum of coupon probability is not 1 \n";
            alert(err);
            return;
        }
    }
 
    if (err != "") alert (err);

    return err == "";
}


function cpCalType1 (n) {
    var sum1 = 0;
    var sum2 = 0;
    for (var i = 1; i <= n; i ++) {
        sum1 += 1/i;
        sum2 += 1/ Math.pow(i, 2);
    }
    var exp_v = sum1 * n;
    var variance = Math.pow(n, 2) * sum2 - n * sum1;
    
    // dist
    var lim = 0.001;
    var dist = [[], []];
    var p = 1/n;
    var t = 0;
    var f_t = 0;
    // optimize with recursion for a ^ x
    while ((1 - f_t) > lim) {
        dist[0].push(t);
        dist[1].push(f_t);
        t += 1;
        f_t = Math.pow(1 - Math.exp(-p*t), n);
        
    }
 

    document.getElementById("cp_expectedV").innerHTML = exp_v;
    document.getElementById("cp_var").innerHTML = variance;
    var ctx = document.getElementById("cp_dist").getContext('2d');
    
    buildChart(ctx, dist);
      
}



function cpCalType2 (p_lst) {
    // get sum of p_combinations table
    var sum_p_table = combine_sum_p(p_lst);

    // expected value, variance
    var exp_v = 0;
    var variance = 0; 
    
    for (const opr_count of sum_p_table.keys()) {
        sums = sum_p_table.get(opr_count);
        sums.forEach(p_sum => {
            exp_v += Math.pow (-1, opr_count-1) * (1/p_sum);
                    
            variance += Math.pow (-1, opr_count-1) * (1/ Math.pow(p_sum, 2));
            return exp_v, variance;
        });
      
    }
    variance = 2*variance - Math.pow(exp_v, 2) - exp_v; 

    // dist
    var lim = 0.001;
    var dist = [[], []];
    var t = 0;
    var f_t = 0;
    while ((1 - f_t) > lim) {
        dist[0].push(t);
        dist[1].push(f_t);
        t += 1;
        f_t = 1;
        for (var i = 0; i < p_lst.length; i++) {
            var p = p_lst[i];
            f_t *= 1 - Math.exp(-p*t);
        }
    }

    // show result
    document.getElementById("cp_expectedV").innerHTML = exp_v;
    document.getElementById("cp_var").innerHTML = variance;
    var ctx = document.getElementById("cp_dist").getContext('2d');
    buildChart(ctx, dist);
    
}



function combine_sum_p (p_lst) {
    let table =  new Map(); // key: number of operands, value: sum of combin. of operands 
    for (var i = 1; i <= p_lst.length; i++){
        table.set(i, []);
    }
    combine(p_lst, table, -1, 0, 0);
    return table;


}
function combine (p_lst, table, curr_idx, sum, n) {
    if (curr_idx == p_lst.length -1) return;
    for (var nxt = curr_idx +1; nxt < p_lst.length; nxt++) {
        sum += p_lst[nxt];
        table.get(n+1).push(sum);
        combine (p_lst, table, nxt, sum, n+1);
        sum -= p_lst[nxt];
    }

}

function buildChart(ctx, dist) {
    try {
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dist[0],
                datasets: [{
                    label: 'density distribution', // Name the series
                    data: dist[1], // Specify the data values array
                    fill: true,
                    borderColor: '#2196f3', // Add custom color border (Line)
                    backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
                    borderWidth: 1 // Specify bar border width
                }]
            },
            options: {
              responsive: true, // Instruct chart js to respond nicely.
              maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
            }
        });
    }
    catch (err) {
        throw ("Error");
    }

function openMenu(evt, menuName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("calculator");
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
     tablinks[i].className = tablinks[i].className.replace("w3-red", "");
  }
  document.getElementById(menuName).style.display = "block";
  evt.currentTarget.firstElementChild.className += " w3-red";
}
document.getElementById("myLink").click();
}

// M/M/1
const qtType1InputShow = () => {
    document.getElementById("qt_type_1_input").style.display = "block";
    document.getElementById("qt_type_2_input").style.display = "none";
    // document.getElementById("qt_input").innerHTML = document.getElementById("qt_type_1_input").innerHTML;
}

const qtType2InputShow = () => {
    document.getElementById("qt_type_1_input").style.display = "none";
    document.getElementById("qt_type_2_input").style.display = "block";
    // document.getElementById("qt_input").innerHTML = document.getElementById("qt_type_2_input").innerHTML;
}

const qtSubmitOnClick = () => {
    var mean_arv_time = parseFloat(document.getElementById("mean_arv_time").value);
    var mean_svc_time = parseFloat(document.getElementById("mean_svc_time").value);
    var min_svc_time = parseFloat(document.getElementById("min_svc_time").value);
    var max_svc_time = parseFloat(document.getElementById("max_svc_time").value);
    var type_1 = document.getElementById("qt_type_1").checked;
    var type_2 = document.getElementById("qt_type_2").checked;

    if (type_1 && qtValidateInputType1(mean_arv_time, mean_svc_time))
        qtCalType1(mean_arv_time, mean_svc_time);
    else if (type_2 && qtValidateInputType2(mean_arv_time, min_svc_time, max_svc_time)) 
        qtCalType2(mean_arv_time, min_svc_time, max_svc_time);
    

}
 
   

function qtCalType1 (mean_arv_time, mean_svc_time) {
    var lambda = 1/mean_arv_time;
    var mu = 1/mean_svc_time;
    var var_arv = 1/Math.pow(lambda, 2);
    var var_svc = 1/Math.pow(mu, 2);
    var p_svr_busy = lambda/mu;
    var l_q = Math.pow(p_svr_busy, 2) / (1 - p_svr_busy);
    var w_q = l_q/lambda;
    var w = w_q + 1/mu;
    var l = lambda * w;
    var p_svr_idle = 1 - p_svr_busy;
    document.getElementById("mean_arv_rate").innerHTML = lambda;
    document.getElementById("mean_svc_rate").innerHTML = mu;
    document.getElementById("var_arv").innerHTML = var_arv;
    document.getElementById("var_svc").innerHTML = var_svc;
    document.getElementById("p_svr_busy").innerHTML = p_svr_busy;
    document.getElementById("mean_q_cust").innerHTML = l_q;
    document.getElementById("mean_q_wait").innerHTML = w_q;
    document.getElementById("mean_sys_cust").innerHTML = l;
    document.getElementById("mean_sys_wait").innerHTML = w;
    document.getElementById("p_svr_idle").innerHTML = p_svr_idle;

}

// M/G/1 
function qtCalType2(mean_arv_time, min_svc_time, max_svc_time) {
    var lambda = 1/mean_arv_time;
    var mean_svc_time = (min_svc_time+max_svc_time)/2;
    var mean_svc_rate = 1/mean_svc_time;
    var var_svc_time = Math.pow((max_svc_time-min_svc_time),2)/12;
    var var_arv_time = 1/Math.pow(lambda, 2);
    var prob_busy = lambda/mean_svc_rate;
    var mean_queue_customer = (Math.pow(lambda,2)*var_svc_time+Math.pow(prob_busy,2))/2*(1-prob_busy);
    var mean_queue_waiting = mean_queue_customer/lambda;
    var mean_sys_waiting = mean_queue_waiting+1/mean_svc_rate;
    var mean_sys_customer = lambda*mean_sys_waiting
    var prob_idle = 1- prob_busy;
    document.getElementById("mean_arv_rate").innerHTML = lambda;
    document.getElementById("mean_svc_rate").innerHTML = mean_svc_rate;
    document.getElementById("var_arv").innerHTML = var_arv_time;
    document.getElementById("var_svc").innerHTML = var_svc_time;
    document.getElementById("p_svr_busy").innerHTML = prob_busy;
    document.getElementById("mean_q_cust").innerHTML = mean_queue_customer;
    document.getElementById("mean_q_wait").innerHTML = mean_queue_waiting;
    document.getElementById("mean_sys_cust").innerHTML = mean_sys_customer;
    document.getElementById("mean_sys_wait").innerHTML = mean_sys_waiting;
    document.getElementById("p_svr_idle").innerHTML = prob_idle;
}
function qtValidateInputType1(mean_arv_time, mean_svc_time){
    var err = "";
    if (isNaN(mean_arv_time) || isNaN(mean_svc_time)) err += "Error: input values must be numbers\n";
    else {
        if (mean_arv_time <= 0) err += "Error: customer inter-arrival time must be positive \n";
        if (mean_svc_time <= 0) err += "Error: service time must be positive \n";
        if (mean_arv_time < mean_svc_time) 
            err += "Error: service time must be less than customer inter-arrival time, or your queue of customers would be infinite \n";
    }
 
    if (err != "") alert(err);
    return err == "";

}

function qtValidateInputType2(mean_arv_time, min_svc_time, max_svc_time){
    var err = "";
    if (isNaN(mean_arv_time) || isNaN(min_svc_time) || isNaN(max_svc_time)) err += "Error: input values must be numbers\n";
    else {
        if (mean_arv_time <= 0) err += "Error: customer inter-arrival time must be positive \n";
        if (min_svc_time <= 0 || max_svc_time <= 0) err += "Error: service time must be positive \n";
        if (min_svc_time > max_svc_time) err += "Error: minimum service time cannot be larger than maximum service time \n";
        if (max_svc_time >= mean_arv_time) 
            err += "Error: service time must be less than customer inter-arrival time, or your queue of customers would be infinite\n";
    }

    if (err != "") alert(err);
    return err == "";

}
const cpShowProbs=() => {
    var x = document.getElementById("cp problems");
    if (x.style.display == "none") {
        x.style.display = "block";  
    } else {
        x.style.display = "none";
  }
}


const qtShowProbs=() => {
    var x = document.getElementById("qt problems");
    if (x.style.display == "none") {
        x.style.display = "block";  
    } else {
        x.style.display = "none";
  }
}

const qtShowNotation=() => {
    var x = document.getElementById("qt notation");
    if (x.style.display === "none") {
        x.style.display = "block";  
    } else {
        x.style.display = "none";
  }
}

