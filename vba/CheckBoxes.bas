Attribute VB_Name = "CheckBoxes"
Sub CheckBox_DetailedGeographicalScope()
    
    Dim inputWS As Worksheet
    Set inputWS = ThisWorkbook.Worksheets("Input")
    
    'CheckBoxes have value 1 for ticked, -4146 for not-ticked
    ThisWorkbook.Names("helper_geographicalScope_detailedView").RefersToRange.value = _
        (inputWS.Shapes("CB_DetailedGeographicalScope").ControlFormat.value = xlOn)
    
    Call showHide_GeoScopeDetail
    
End Sub

Sub CheckBox_TransportationType()
    
    Dim inputWS As Worksheet
    Set inputWS = ThisWorkbook.Worksheets("Input")
    
    Dim cb_checked As Boolean
    cb_checked = (inputWS.Shapes("CB_TransportationType").ControlFormat.value = xlOn)
    
    ThisWorkbook.Names("helper_TransportationType_splitAvailable").RefersToRange.value = _
        cb_checked
    Call showHide_TransportationType(show:=cb_checked)
    
End Sub

Sub CheckBox_Exhibitions()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_Exhibitions", _
                                            yesNoCell:="\selected_additional_YesNo_Messen")
End Sub

Sub CheckBox_WorksOfArt()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_WorksOfArt", _
                                            yesNoCell:="\selected_additional_YesNo_Kunst")
End Sub

Sub CheckBox_HouseholdGoods()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_HouseholdGoods", _
                                            yesNoCell:="\selected_additional_YesNo_Umzug")
End Sub

Sub CheckBox_ConsequentialDamage()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_ConsequentialDamage", _
                                            yesNoCell:="\selected_additional_YesNo_Gueterfolge")
End Sub

Sub CheckBox_FinancialLoss()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_FinancialLoss", _
                                            yesNoCell:="\selected_additional_YesNo_Vermoegen")
End Sub

Sub CheckBox_War()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_War", _
                                            yesNoCell:="\selected_additional_YesNo_Krieg")
End Sub

Sub CheckBox_IP()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_IP", _
                                            yesNoCell:="\selected_additional_YesNo_IP")
End Sub

Sub CheckBox_Luggage()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_Luggage", _
                                            yesNoCell:="\selected_additional_YesNo_Luggage")
End Sub

Sub CheckBox_Cyber()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_Cyber", _
                                            yesNoCell:="\selected_additional_YesNo_Cyber")
End Sub

Sub CheckBox_Pandemic()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_Pandemic", _
                                            yesNoCell:="\selected_additional_YesNo_Pandemic")
End Sub

Sub CheckBox_ProtectionAndConditionDifference()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_ProtAndCondDiff", _
                                            yesNoCell:="\selected_additional_YesNo_Schutz")
End Sub

Sub CheckBox_StrikeAndRiot()
    Call additionalCoverageCheckboxClicked(checkBoxName:="CB_StrikeAndRiot", _
                                            yesNoCell:="\selected_additional_YesNo_Streik")
End Sub

Sub additionalCoverageCheckboxClicked(checkBoxName As String, yesNoCell As String)

    Dim inputWS As Worksheet
    Set inputWS = ThisWorkbook.Worksheets("Input")
    
    With inputWS.Shapes(checkBoxName).ControlFormat
        If .value = 1 Then
            ThisWorkbook.Names(yesNoCell).RefersToRange.value = "Yes"
        Else
            ThisWorkbook.Names(yesNoCell).RefersToRange.value = "No"
        End If
    End With
End Sub
