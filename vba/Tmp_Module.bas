Attribute VB_Name = "Tmp_Module"
Sub renameName()
    
    Dim currentName As Name
    Dim tmpString As String
    For Each currentName In ThisWorkbook.Names
        tmpString = currentName.Name
        If Left(tmpString, Len("\natCat")) = "\natCat" Then
            currentName.Name = Replace(tmpString, "\natCat", "\storage")
        End If
    Next currentName
    
End Sub


Sub Continents()
Dim i As Integer, j As Integer, n As Integer
Dim continentList(8) As String, formulaList(8) As String

    For i = 0 To 8
        continentList(i) = Sheets("Input").Cells(21, i + 4).value
        formulaList(i) = continentList(i)
    Next i

    formulaList(3) = "N_Europe"
    formulaList(4) = "E_Europe"
    formulaList(5) = "S_Europe"
    formulaList(6) = "W_Europe"
    formulaList(7) = "N_America"
    formulaList(8) = "S_America"

    For i = 0 To 8
        For j = 0 To 8
            Sheets("Algorithm").Cells(28 + n, 7).value = continentList(i) & " - " & continentList(j)

'            If j <> i Then
'                Sheets("Algorithm").Cells(28 + n, 8).Formula = "= \selected_geoscope_int_" & formulaList(i) & "_to_" & _
'                    formulaList(j) & " + \selected_geoscope_int_" & formulaList(j) & "_to_" & formulaList(i)
'            Else
            Sheets("Algorithm").Cells(28 + n, 8).Formula = "= \selected_geoscope_int_" & formulaList(i) & "_to_" & _
                formulaList(j)
'            End If
            n = n + 1
        Next j
    Next i

End Sub


Sub TypeOfGoods()
Dim i As Integer, j As Integer, n As Integer

    i = 28
    j = 4
    n = 5

    While Not IsEmpty(Sheets("References").Cells(3, i).value)
        While Not Sheets("References").Cells(j, i).value = ""
            Sheets("Parameter").Cells(n, 25).value = Sheets("References").Cells(3, i).value
            Sheets("Parameter").Cells(n, 26).value = Sheets("References").Cells(j, i).value

            j = j + 1
            n = n + 1
        Wend

        If j = 4 Then
            Sheets("Parameter").Cells(n, 25).value = Sheets("References").Cells(3, i).value

            n = n + 1
        End If

        i = i + 1
        j = 4
    Wend
End Sub


Sub ContinentsParameter()

Dim i As Integer, j As Integer, n As Integer
Dim continentList(14) As String

    continentList(0) = "North Africa"
    continentList(1) = "East Africa"
    continentList(2) = "South Africa"
    continentList(3) = "West Africa"
    continentList(4) = "Central Africa"
    continentList(5) = "Asia"
    continentList(6) = "SouthEast Asia"
    continentList(7) = "Australia"
    continentList(8) = "Near East"
    continentList(9) = "North Europe"
    continentList(10) = "East Europe"
    continentList(11) = "South Europe"
    continentList(12) = "West Europe"
    continentList(13) = "North America"
    continentList(14) = "South America"

    n = 87

    For i = 0 To 14
        For j = 0 To 14
            Sheets("Parameter").Cells(n, 56).value = continentList(i) & " - " & continentList(j)
            Sheets("Parameter").Cells(n, 57).value = 1
            Sheets("Parameter").Cells(n, 58).value = 1
            Sheets("Parameter").Cells(n, 59).value = 1
            Sheets("Parameter").Cells(n, 60).value = 1
            Sheets("Parameter").Cells(n, 61).value = 1
            n = n + 1
        Next j
    Next i
End Sub

Sub ContinentsReferences()

Dim i As Integer, n As Integer
Dim continentList(14) As String

    continentList(0) = "North Africa"
    continentList(1) = "East Africa"
    continentList(2) = "South Africa"
    continentList(3) = "West Africa"
    continentList(4) = "Central Africa"
    continentList(5) = "Asia"
    continentList(6) = "SouthEast Asia"
    continentList(7) = "Australia"
    continentList(8) = "Near East"
    continentList(9) = "North Europe"
    continentList(10) = "East Europe"
    continentList(11) = "South Europe"
    continentList(12) = "West Europe"
    continentList(13) = "North America"
    continentList(14) = "South America"

    n = 4

    For i = 0 To 14
        Sheets("References").Cells(i + n, 50).value = continentList(i)
    Next i
End Sub

Sub CellNames()
    
    Dim i As Integer, j As Integer, n As Integer
    n = 16
    With ThisWorkbook.Worksheets("Input")
        For i = 73 To 77
            For j = 1 To 1
                ThisWorkbook.Worksheets("Parameter").Cells(n, 100).value = .Cells(i, j).Name.Name
                n = n + 1
            Next j
            For j = 3 To 3
                ThisWorkbook.Worksheets("Parameter").Cells(n, 100).value = .Cells(i, j).Name.Name
                n = n + 1
            Next j
            For j = 5 To 7
                ThisWorkbook.Worksheets("Parameter").Cells(n, 100).value = .Cells(i, j).Name.Name
                n = n + 1
            Next j
            For j = 9 To 9
                ThisWorkbook.Worksheets("Parameter").Cells(n, 100).value = .Cells(i, j).Name.Name
                n = n + 1
            Next j
        Next i
        For i = 79 To 84
            For j = 1 To 1
                ThisWorkbook.Worksheets("Parameter").Cells(n, 100).value = .Cells(i, j).Name.Name
                n = n + 1
            Next j
            For j = 3 To 3
                ThisWorkbook.Worksheets("Parameter").Cells(n, 100).value = .Cells(i, j).Name.Name
                n = n + 1
            Next j
            For j = 5 To 7
                ThisWorkbook.Worksheets("Parameter").Cells(n, 100).value = .Cells(i, j).Name.Name
                n = n + 1
            Next j
            For j = 9 To 9
                ThisWorkbook.Worksheets("Parameter").Cells(n, 100).value = .Cells(i, j).Name.Name
                n = n + 1
            Next j
        Next i
    End With
End Sub

Sub list_Names()

    Dim nm As Name
    Dim i As Integer
    
    i = 0
    For Each nm In ThisWorkbook.Names
        If Left(nm.RefersTo, 7) = "=Input!" Then
            i = i + 1
            ThisWorkbook.Worksheets("Dev_Sheet").Cells(i + 1, 1).value = nm.Name
            ThisWorkbook.Worksheets("Dev_Sheet").Cells(i + 1, 2).value = nm.RefersToRange.value
        End If
    Next nm

End Sub
