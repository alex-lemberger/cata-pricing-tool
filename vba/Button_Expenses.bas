Attribute VB_Name = "Button_Expenses"
Sub Expenses_Loading()
    
    Application.screenUpdating = False
    Application.Calculation = xlCalculationManual
    
    Const GUI = "GUI"
    Const ALGORITHM = "Algorithm"

    Dim curr As String
    Dim LoB As String
    Dim top As String
    Dim ip As String
    Dim brokerage As Double
    Dim additionalCosts As Double
    Dim leadingFee As Double
    Dim brokerageFlag As String
    Dim additionalCostsFlag As String
    Dim leadingFeeFlag As String
    Dim producingOffice As String
    Dim riskPremium As Currency
    Dim expectedLoss As Currency
    Dim stdDev As Currency
    
    Dim cataWB As Workbook
    Dim ExpensesWB As Workbook
    
    'Get Data from first sheet
    With ThisWorkbook.Worksheets("Input")
        curr = "EUR"
        LoB = "Marine"
        top = .Range("\selected_typeofparticipation").value
        ip = .Range("\selected_ipflag").value
        brokerage = .Range("\selected_brokeragevalue").value
        additionalCosts = .Range("\selected_additionalcostsvalue").value
        leadingFee = .Range("\selected_leadingfeevalue").value
        brokerageFlag = ThisWorkbook.Worksheets("Algorithm").Range("calc_brokerageflag").value
        additionalCostsFlag = ThisWorkbook.Worksheets("Algorithm").Range("calc_additionalcostsflag").value
        leadingFeeFlag = ThisWorkbook.Worksheets("Algorithm").Range("calc_leadingfeeflag").value
        producingOffice = .Range("\selected_branch").value
        If Left(producingOffice, 7) = "Germany" Then producingOffice = "GERMANY"
    End With
    Set cataWB = ActiveWorkbook
        
    Application.Calculation = xlCalculationAutomatic
    'Clear potential previous Expenses
    cataWB.Worksheets(ALGORITHM).Range("calc_decentral_expenses_ELC").ClearContents
    cataWB.Worksheets(ALGORITHM).Range("calc_central_expenses_ELC").ClearContents
    Application.Calculation = xlCalculationManual
        
    'Get Premiums and StdDev
    If VarType(ThisWorkbook.Names("calc_riskpremium_EUR").RefersToRange.value) = vbError Then
        riskPremium = ThisWorkbook.Names("calc_expectedloss_EUR").RefersToRange.value
    Else
        riskPremium = Range("calc_riskpremium_EUR").value
    End If
    expectedLoss = Range("calc_expectedloss_EUR").value
    'stdDev = Range("Std_Dev_Primary").Value
    
    'Kostenrechner öffnen
    'Workbooks.Open Filename:="L:\Crossing-Departments\I.Proj.Property_2020\_Actuaries_Default_Files\Expenses_Loadings_Tool.xlsm"
    Application.Calculation = xlCalculationAutomatic
    
    Workbooks.Open fileName:="\\talanx.sharepoint.com@SSL\DavWWWRoot\sites\GlobalActuarialPricing\Expenses  Loadings documents\Expenses_Loadings_Calculator.xlsm"
    Set ExpensesWB = ActiveWorkbook
    If (ExpensesWB.AutoSaveOn = True) Then ExpensesWB.AutoSaveOn = False
    
    'Input Data from first sheet into Expenses Tool
    With ExpensesWB.Worksheets(GUI)
        .Range("\selected_Currency").value = curr
        .Range("\selected_Sparte").value = LoB
        .Range("\selected_Zeichnungsart").value = top
        .Range("\selected_Ip_nIP").value = ip
        .Range("\selected_Brokerage").value = brokerage
        .Range("\selected_OtherExpenses").value = additionalCosts
        .Range("\selected_LeadingFee").value = leadingFee
        .Range("\selected_BrokerageType").value = brokerageFlag
        .Range("\selected_OtherExpensesType").value = additionalCostsFlag
        .Range("\selected_LeadingFeeType").value = leadingFeeFlag
        .Range("\selected_InputType").value = "Expected Loss"
        .Range("\selected_LAP_Account_2").value = "No"
        .Range("\selected_Producing_Office").value = producingOffice
        .Range("\selected_Global_Risk_Hub").value = "Local"
    End With
    
    'Insert riskPremiums and extract Expenses
    With ExpensesWB.Worksheets(GUI)
        .Range("\selected_RiskPrem") = riskPremium
        .Range("\selected_ExpLossPrem") = expectedLoss
        '.Range("\selected_Std_Dev") = stdDev
    End With
    
    Application.Calculation = xlCalculationAutomatic
    Application.Calculation = xlCalculationManual
    
    With cataWB.Worksheets(ALGORITHM)
        .Range("calc_volatilityloading_polCur").value = ExpensesWB.Worksheets(GUI).Range("\Output_Volatility_Loading").value
        .Range("calc_technicalpremium_polCur_from_ELC").value = ExpensesWB.Worksheets(GUI).Range("\Output_Technical_Premium").value
        .Range("calc_decentral_expenses_ELC")(1, 1).value = ExpensesWB.Worksheets(GUI).Range("AdminCost1_R").value
        .Range("calc_decentral_expenses_ELC")(2, 1).value = ExpensesWB.Worksheets(GUI).Range("ClaimCost1_R").value
        .Range("calc_central_expenses_ELC")(1, 1).value = ExpensesWB.Worksheets(GUI).Range("AdminCost2_R").value
        .Range("calc_central_expenses_ELC")(2, 1).value = ExpensesWB.Worksheets(GUI).Range("ClaimCost2_R").value
        .Range("calc_additional_costs").value = ExpensesWB.Worksheets(GUI).Range("OtherCosts_R").value
        .Range("calc_leading_fee").value = ExpensesWB.Worksheets(GUI).Range("Leading_free_R").value
        .Range("calc_brokerage").value = ExpensesWB.Worksheets(GUI).Range("Brokerage_R").value
        
        'IMPORTANT: NAME CELL IN ELC
        .Range("calc_volatility_loading").value = ExpensesWB.Worksheets(GUI).Range("F40").value
        '#############################
    End With
    
'    With ExpensesWB.Worksheets(GUI)
'        .Range("\selected_InputType") = "Technical Premium"
'    End With
    
    'Close Expenses Loading Tool without Saving Prompt
    If cataWB.Worksheets("Output").Range("out_elcOpen") <> "Yes" Then ExpensesWB.Close SaveChanges:=False
    
    Application.screenUpdating = True
    Application.Calculation = xlCalculationAutomatic
    
'    If cataWB.Worksheets("Output").Range("C72").value < 2500 Then
'        MsgBox "Achtung!!! Technische Prämie <2500€; Bitte beachte die Mindestprämie von 2.500€!"
'    End If
    
    
End Sub
