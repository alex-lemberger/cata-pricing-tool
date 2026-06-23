Attribute VB_Name = "Sheet11"
Attribute VB_Base = "0{00020820-0000-0000-C000-000000000046}"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = True
Attribute VB_TemplateDerived = False
Attribute VB_Customizable = True
Private Sub Worksheet_Change(ByVal Target As Range)
    
    If Not (Intersect(Target, ThisWorkbook.Names("\storageInput_Deductible_Type").RefersToRange) Is Nothing) Then
        Dim dedType As String
        dedType = ThisWorkbook.Names("\storageInput_Deductible_Type").RefersToRange.value
        If dedType = "Percentage" Then
            Call hideShowDeductibles(percentageDeductible:=True)
        Else
            Call hideShowDeductibles(percentageDeductible:=False)
        End If
    End If
    
End Sub

Sub hideShowDeductibles(percentageDeductible As Boolean)

    ThisWorkbook.Names("\storageInput_Deductible_FixedAmount").RefersToRange.EntireColumn.Hidden = percentageDeductible
    Union(ThisWorkbook.Names("\storageInput_Deductible_PercentageAmount").RefersToRange, _
        ThisWorkbook.Names("\storageInput_Deductible_Min").RefersToRange, _
        ThisWorkbook.Names("\storageInput_Deductible_Max").RefersToRange).EntireColumn.Hidden = _
            Not (percentageDeductible)

End Sub
