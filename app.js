var username;
var ledgerData;

$(document).ready(function(){
	var ledger = new Ledger($("#ledger"))
	
	$.ajax({
			type : "GET",
			dataType : 'json',
			url : "http://localhost:3000/api/v1/accounts/1"
	}).done(function(data){
			ledgerData = data;
			ledger.generate(ledgerData)
			username = data.account["name"]
			// console.log(data)
	});


	console.log(ledgerData)


	var debit = new LoanForm($("#new-debit"), false);
	var credit = new LoanForm($("#new-credit"), true);
	var newLoan = new NewLoan(debit, credit);

	$("#new-credit").click(function(){
		newLoan.activeCredit();

	})
	$("#new-debit").click(function(){
		newLoan.activeDebit();
	})
	


	$("#submit-loan").click(function(){
		var activeForm = newLoan.active
		// var form = $("#loan-form")

		var debtorName;
		var creditorName;
		var loan_type;

		if (activeForm.isDebtor){
			debtorName = username;
			creditorName = activeForm.$loan.children().children('.loan-creditor').val();
			loan_type = "credit";
		} else {
			debtorName = activeForm.$loan.children().children('.loan-debtor').val();
			creditorName = username;
			loan_type = "debit";
		}
		
		var amount = $(activeForm.$loan.children().children(".loan-amount")[0]).val();
		var description = $(activeForm.$loan.children().children(".loan-description")[0]).val();

		var formData = {"loan": {
									"creditor_name" : creditorName,
									"debtor_name" : debtorName,
									"amount" : amount,
									"description" : description,
									"type": loan_type,
									"created_at": "Just now!"
								},
							};

		$.ajax({
			type : "POST",
			dataType : 'json', 
			data : formData,
			url : "http://localhost:3000/api/v1/accounts/1/loans"
		}).done(function(data){

			console.log("yay")
			console.log(data)
		});

		if (formData.loan["type"] == "debit") {
			ledger.addDebit(formData);
		} else {
			ledger.addCredit(formData);
		}

		//

	})


})

function LoanForm($loan, user_debtor) {
	this.$loan = $loan;
	this.isDebtor = user_debtor
	this.active = false;
}
LoanForm.prototype.activate = function(){
	this.active = true;
	this.$loan.removeClass("inactive").addClass("active")
}
LoanForm.prototype.inactivate = function(){
	this.active = false;
	this.$loan.removeClass("active").addClass("inactive")
}
//////////////////
function NewLoan(debitForm, creditForm) {
	this.debitForm = debitForm;
	this.creditForm = creditForm;
	this.active;
}
NewLoan.prototype.activeDebit = function(){
	this.debitForm.activate();
	this.creditForm.inactivate();
	this.active = this.debitForm;
}
NewLoan.prototype.activeCredit = function(){
	this.creditForm.activate();
	this.debitForm.inactivate();

	this.active = this.creditForm;
}

function Ledger(ledger) {
	this.$ledger = ledger
};

Ledger.prototype.addDebit = function(loan){
	var string = "<li class='debit'>"+loan.loan.debtor_name +" owes me $"+loan.loan.amount+" for "+(loan.loan["description"] || "something")+" -- "+loan.loan.created_at+"</li>"
	$('#loan-form input').val('')
	this.$ledger.prepend(string).show()
}

Ledger.prototype.addCredit = function(loan){
	var string = "<li class='credit'>I owe "+loan.loan.creditor_name +" $"+loan.loan.amount+" for "+(loan.loan["description"] || "something")+" -- "+loan.loan.created_at+"</li>"
	$('#loan-form input').val('')
	this.$ledger.prepend(string).show('slow')
}

Ledger.prototype.generate = function(loan_data){
	var l = this

	var loans = loan_data.account.loans
	_.each(loans, function(loan){
		if (loan.loan["type"]=="debit"){
			l.addDebit(loan)
		} else {
			l.addCredit(loan)
		}
	})	

		// debugger
	// loans.sort(function(loan){
	// 	return new Date(loan.loan.created_at)
	// })
	// debugger

	// _.each(loans, function(loan){
	// 	l.$ledger.append(loan.string)
	// })

}

// Ledger.prototype.add

	// var htmlify = function(loan){
	// 	return 
	// }
	// _.each(this.lData, function(loan){
		

	// })









	//get account data




//make a new loan