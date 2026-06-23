Attribute VB_Name = "NatCat_YLT_Import"
Sub CatImport()
    path = ThisWorkbook.path
    ChDir path
    
    Dim simWB As Workbook
    Set simWB = ActiveWorkbook
    Dim m As Integer
    
    m = 5 * n
    If n = 5 Then m = m + 1
    
    Range(Range("Out_3").Offset(0, m), Range("Out_3").Offset(9999, 3 + m)).ClearContents
        
    Datei = Application.GetOpenFilename("Comma seperated Value (*.csv),*.csv", , title:="Choose data file for input")
    
    If Datei = False Then
        MsgBox "No File has been chosen."
        Exit Sub
    End If
    
    Workbooks.Open fileName:=Datei
    
    Dim catWB As Workbook
    Set catWB = ActiveWorkbook
    
    Dim firstCell As Range
    Dim firstCellValue As Variant
    
    'checks if the first cell contains entries with ""
    Set firstCell = catWB.ActiveSheet.Range("A1")
    firstCellValue = firstCell.value
    If InStr(firstCellValue, """") Then
        'if yes then split the words in this cell at the ','
        Dim j As Integer
        Dim splitValues() As String
        splitValues = Split(firstCellValue, ",")
        
        'Overwrites the header with the splited values and remove the ".
        firstCell.Offset(0, 1).Resize(1, UBound(splitValues) + 1).ClearContents
        For j = LBound(splitValues) To UBound(splitValues)
            firstCell.Offset(0, j).value = Replace(Trim(splitValues(j)), """", "")
        Next j
    End If
    
    'Check in which Column is year, FGU, gross and context
    Dim i As Integer
    Dim yearCol As Integer, fguCol As Integer, grossCol As Integer, contextCol As Integer
    i = 1
    While (Not IsEmpty(catWB.ActiveSheet.Cells(1, i))) Or i <= 4
        If catWB.ActiveSheet.Cells(1, i).value = "year_id" Then
            yearCol = i
        ElseIf catWB.ActiveSheet.Cells(1, i).value = "cgu" Then
            fguCol = i
        ElseIf catWB.ActiveSheet.Cells(1, i).value = "gr" Then
            grossCol = i
        ElseIf catWB.ActiveSheet.Cells(1, i).value = "context" Then
            contextCol = i
        End If
        i = i + 1
    Wend
    
    'Filter For Context = -1
    
    With ActiveSheet
        .Range("B1").AutoFilter
        .Range(.Cells(1, 1), .Cells(1, i - 1)).AutoFilter Field:=contextCol, Criteria1:="-1"
    End With
    'ActiveSheet.Range(Cells(1, 1), Cells(1, i - 1)).AutoFilter Field:=3, Criteria1:="-1"
    ActiveWorkbook.ActiveSheet.AutoFilter.Sort. _
        SortFields.Clear
    'ActiveWorkbook.ActiveSheet.AutoFilter.Sort. _
    '    SortFields.Add Key:=Range("D2"), SortOn:=xlSortOnValues, Order:= _
    '    xlAscending, DataOption:=xlSortNormal
    ActiveWorkbook.ActiveSheet.AutoFilter.Sort. _
        SortFields.Add Key:=Range("D2"), SortOn:=xlSortOnValues, Order:= _
        xlAscending, DataOption:=xlSortNormal
    
    With ActiveWorkbook.ActiveSheet.AutoFilter. _
        Sort
        .Header = xlYes
        .MatchCase = False
        .Orientation = xlTopToBottom
        .SortMethod = xlPinYin
        .Apply
    End With
    
    With catWB.ActiveSheet
        Application.Union(.Range(.Cells(2, yearCol), .Cells(10001, yearCol)), .Range(.Cells(2, fguCol), .Cells(10001, fguCol)), _
        .Range(.Cells(2, grossCol), .Cells(10001, grossCol))).Select
    End With
    Selection.Copy
    
    simWB.Activate
    Range("Out_3").Offset(0, m + 1).Select
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks:=False, Transpose:=False
    
    
    Application.CutCopyMode = False
    catWB.Close SaveChanges:=False
    
End Sub


