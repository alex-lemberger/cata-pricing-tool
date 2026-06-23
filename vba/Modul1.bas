Attribute VB_Name = "Modul1"
Enum additionalLinesRequiredEnum
    geographicalScope = 1
    war = 2
    strikeAndRiot = 3
End Enum

Sub Another_option()
    ' -----------------------------------------------------------------------------------------
    ' ----- Makro von Uwe Haleksy, Dezember 2021 ----------------------------------------------
    ' ----- Button: Another option
    ' -----------------------------------------------------------------------------------------
    ' --- Info --------------------------------------------------------------------------------
    ' Dieses Makro erzeugt eine neue Option. Es schreibschützt diese Datei und erstellt eine
    ' neue Datei mit gleichem Basis-Namen, aber nächster Optionsnummer.
    ' Das Makro sollte gedrückt werden, bevor die Eingaben zur neuen Option gemacht werden.
    ' -----------------------------------------------------------------------------------------
Dim altOption As Integer, neuOption As Integer, altDateiName As String, neuDateiName As String, Pfad As String
Dim altOptionsName As String, c As Range
    Pfad = ThisWorkbook.path & "\"
    altOption = Range("\selected_option_Nr")
    altOptionsName = "Option-" & altOption
    neuOption = altOption + 1
    altDateiName = ThisWorkbook.Name
    neuDateiName = Replace(Replace(Replace(altDateiName, ".xlsm", "_Option-" & neuOption & ".xlsm"), altOptionsName, ""), "__", "_")
    ' alte Datei ändern und abspeichern
    ActiveSheet.Unprotect Password:="CaTa2022"
    Range("\selected_status") = "declined"
    Cells.Locked = True
    Cells.FormulaHidden = False
    ActiveSheet.Protect AllowFiltering:=True, userinterfaceonly:=True  ' userinterfaceonly: User kann nicht ändern, Makro schon.
    ActiveSheet.Protect DrawingObjects:=True, Contents:=True, Scenarios:=True, AllowFormattingCells:=True, AllowFormattingRows:=True, AllowFiltering:=True ' 2013 mit Zeilenhöhe veränderbar
    ActiveSheet.EnableAutoFilter = True ' ermöglicht Autofilter
    ActiveSheet.EnableOutlining = True ' ermöglicht Gruppierung/Gliederung
    ActiveSheet.EnableSelection = xlNoRestrictions ' ermöglicht Klick auf schreibgeschützte Zellen
    ThisWorkbook.Save ' alte Version speichern
    ' Neue Version vorbereiten:
    Range("\selected_option_Nr") = neuOption
    ActiveSheet.Unprotect

    Range("\selected_status") = ""
    For Each c In ActiveSheet.UsedRange
        If c.Style = "_Eingabefeld" Or c.Style = "_Dropdown" Or c.Style = "_sonstDatNum" Or c.Style = "_FormelU" Then
            c.MergeArea().Locked = False
        Else
            c.MergeArea().Locked = True
        End If
    Next c

    ThisWorkbook.SaveAs fileName:=Pfad & neuDateiName, FileFormat:=xlOpenXMLWorkbookMacroEnabled, CreateBackup:=False
End Sub

Function createSaveFileName() As String

    Dim path As String
    Dim branch As String
    Dim currentDate As String
    Dim partner As String
    Dim optionNr As String
    Dim character As Variant
    
    branch = ThisWorkbook.Names("\selected_branch").RefersToRange.value
    branch = Replace(branch, ":", "")
    
    path = ThisWorkbook.Names("Grundordner_V").RefersToRange.value
    path = path & "\" & branch & "\"
    
    currentDate = Format(Now, "yyyy-mm")
    
    partner = ThisWorkbook.Names("\selected_partner").RefersToRange.value
    For Each character In Array("""", ">", "<", "?", "/", "|", "\", ":", "*")
        partner = Replace(partner, character, "")
    Next character
    partner = Left(partner, 25)
    
    Dim fileName As String
    fileName = currentDate & "_" & partner & "_Option-" & optionNr & ".xlsm"
    
    createSaveFileName = path & fileName

End Function

Sub Save_option()
    ' -----------------------------------------------------------------------------------------
    ' ----- Makro von Uwe Haleksy, Dezember 2021 ----------------------------------------------
    ' ----- Button: Save option
    ' -----------------------------------------------------------------------------------------
    ' --- Info --------------------------------------------------------------------------------
    ' Dieses Makro erstellt aus der Vorlage eine CaTa-Datei mit einem namen betehend aus dem
    ' Zeitstempel und den ersten 25 Zeichen des Partnernamens und "Option 1".
    ' -----------------------------------------------------------------------------------------
Dim altOption As Integer, neuDateiName As String, Pfad As String, Datum As String, SpeicherName As String
Dim AuswahlAbgebrochen As Boolean

    DatPfadName = createSaveFileName()

    On Error Resume Next
    SpeicherName = Application.GetSaveAsFilename( _
        InitialFileName:=DatPfadName, _
        FileFilter:="Excel-Arbeitsmappe mit Makros (*.xlsm), *.xlsm", _
        title:="Speichern als")
    AuswahlAbgebrochen = (SpeicherName = False)
    On Error GoTo 0
    If Not AuswahlAbgebrochen = False Then
        MsgBox (vbCr & _
            "File not saved as required." & vbCr & _
            vbCr & "________________________________________________________" & vbCr & _
            " "), vbCritical       ' mit Warnzeichen
        AktivesMakro = AktivesMakro_o
        Exit Sub
    Else
        ThisWorkbook.SaveAs SpeicherName
    End If
End Sub


Private Sub Argos_importieren()
    ' -----------------------------------------------------------------------------------------
    ' ----- Makro von Uwe Haleksy, Dezember 2021 ----------------------------------------------
    ' ----- Button: ARGOS import
    ' -----------------------------------------------------------------------------------------
    ' --- Info --------------------------------------------------------------------------------
    ' Dieses Makro löscht die Inhalte des Blattes "ARGOS Data" und importiert eine frei wählbare
    ' Argos-Liste und verlängert ggf. den Bereich der Argos-Liste im Blatt "Input".
    ' -----------------------------------------------------------------------------------------
Dim Pfad As String, Datei As Variant, quell As Workbook, qZeilen As Long, qSpalten As Long
Dim ziel As Workbook, zZeilen As Long, zSpalten As Long, eZeilen As Variant, uZeilen As Long, vZeilen As Long
Dim Zeitpunkt As Double, Ende As Double, Entscheidung As Variant, wzä As Integer

    Application.screenUpdating = True
    Range("LL_Kopf").Offset(-1, 0).Interior.Color = RGB(255, 0, 0) ' §§§§
    Pfad = Range("Grundordner_V")
    Set ziel = ThisWorkbook
    ChDir Pfad
    Datei = Application.GetOpenFilename(, , title:="Choose data file for input")

    If Datei = False Then
        Exit Sub
    End If
    Set quell = Workbooks.Open(Datei)
    Application.screenUpdating = False

    Application.DisplayAlerts = False
    ' Zieldatei leeren
    zZeilen = ziel.Worksheets("ARGOS Data").Cells(Rows.Count, 1).End(xlUp).Row
    zSpalten = ziel.Worksheets("ARGOS Data").Cells(1, Columns.Count).End(xlToLeft).Column
    ziel.Worksheets("ARGOS Data").Range(Cells(1, 1).Address & ":" & Cells(zZeilen, zSpalten).Address).ClearContents
    ziel.Worksheets("ARGOS Data").Range(Cells(1, 1).Address & ":" & Cells(zZeilen, zSpalten).Address).ClearContents
    Application.Run "graue_Rahmen_entfernen", ziel.Worksheets("ARGOS Data").Range(Cells(1, 1).Address & ":" & Cells(zZeilen, zSpalten).Address)

    qZeilen = quell.Worksheets("DATA").Cells(Rows.Count, 1).End(xlUp).Row
    qSpalten = quell.Worksheets("DATA").Cells(1, Columns.Count).End(xlToLeft).Column
    ziel.Worksheets("ARGOS Data").Range(Cells(1, 1).Address & ":" & Cells(qZeilen, qSpalten).Address).value = quell.Worksheets("DATA").Range(Cells(1, 1).Address & ":" & Cells(qZeilen, qSpalten).Address).value
    Application.Run "graue_Rahmen_setzen", ziel.Worksheets("ARGOS Data").Range(Cells(1, 1).Address & ":" & Cells(qZeilen, qSpalten).Address)
    quell.Close
    Worksheets("Input").Select
    ' vZeilen = Application.Max(Range("LL_Zeilen"))
    vZeilen = Range("LL_Zeilen").Count
    If qZeilen > vZeilen Then
        If qZeilen > vZeilen Then

            eZeilen = qZeilen - vZeilen

        End If

        zzZeile = Range("zzZeile").Row
        If eZeilen > 0 Then
            Range(Cells(zzZeile, 1), Cells(zzZeile + eZeilen - 1, Range("Argos_Beschreibung_Sp").Column)).EntireRow.Insert Shift:=xlDown
            zzZeile = Range("zzZeile").Row
            Range(Cells(zzZeile - eZeilen - 1, 1), Cells(zzZeile - eZeilen - 1, Range("Argos_Beschreibung_Sp").Column)).Select
            Selection.AutoFill Destination:=Range(Cells(zzZeile - eZeilen - 1, 1), Cells(zzZeile - 1, Range("Argos_Beschreibung_Sp").Column)), Type:=xlFillDefault
        ElseIf eZeilen < 0 Then
            Range(Cells(zzZeile + eZeilen, 1), Cells(zzZeile - 1, Range("Argos_Beschreibung_Sp").Column)).Select
            Range(Cells(zzZeile + eZeilen, 1), Cells(zzZeile - 1, Range("Argos_Beschreibung_Sp").Column)).EntireRow.Delete Shift:=xlUp
        End If
    End If

    If qZeilen - 1 > 10 Then
        If qZeilen < vZeilen Then
            ' Argos voll einblenden
            ActiveSheet.Outline.ShowLevels RowLevels:=3
            Rows("" & Range("LL_Zeilen")(1).Row + 10 & ":" & Range("zzZeile").Row - 1 & "").Ungroup
            Rows("" & Range("LL_Zeilen")(1).Row + qZeilen - 1 & ":" & Range("zzZeile").Row - 1 & "").Select
            Rows("" & Range("LL_Zeilen")(1).Row + qZeilen - 1 & ":" & Range("zzZeile").Row - 1 & "").Delete Shift:=xlUp
            Rows("" & Range("LL_Zeilen")(1).Row + 10 & ":" & Range("zzZeile").Row - 1 & "").Group
        Else
            Rows("" & Range("LL_Zeilen")(1).Row + 10 & ":" & Range("zzZeile").Row - 1 & "").Group
            ' Selection.Group
            ' oberste Ebene öffnen, ab 2. Ebene schließen:
        End If
        ' Argos über Zeile 10 ausblenden
        ActiveSheet.Outline.ShowLevels RowLevels:=2
    ElseIf qZeilen < 10 And vZeilen > 10 Then
        ' Argos voll einblenden
        ActiveSheet.Outline.ShowLevels RowLevels:=3
        Rows("" & Range("LL_Zeilen")(1).Row + 10 & ":" & Range("zzZeile").Row - 1 & "").Ungroup
        ' Selection.Rows.Ungroup
        ' Selection.Delete Shift:=xlUp
        Rows("" & Range("LL_Zeilen")(1).Row + 10 & ":" & Range("zzZeile").Row - 1 & "").Delete Shift:=xlUp
    ElseIf qZeilen < 10 And vZeilen <= 10 Then
        vZeilen = vZeilen
    End If

    Range("zzZeile").Select
    Range("zzZeile").Offset(0, 1) = "Total: " & qZeilen - 1

    Application.screenUpdating = True
    Range("LL_Kopf").Offset(-1, 0).Interior.Color = RGB(0, 255, 0) ' §§§§
    Ende = Timer + 0.5 ' Sekunden
    Do While Timer < Ende
        DoEvents
    Loop
    Range("LL_Kopf").Offset(-1, 0).Interior.ColorIndex = xlNone ' §§§§

End Sub

Sub graue_Rahmen_entfernen(z As Range)
    ' -----------------------------------------------------------------------------------------
    ' ----- Makro von Uwe Haleksy, Dezember 2021 ----------------------------------------------
    ' ----- Hilfsmakro
    ' -----------------------------------------------------------------------------------------
    ' --- Info --------------------------------------------------------------------------------
    ' Dieses Makro entfernt die dünnen grauen Zellrahmen im Blatt "ARGOS Data", nachdem die
    ' Liste gelöscht wurde.
    ' -----------------------------------------------------------------------------------------
    With z
        .Borders(xlInsideVertical).LineStyle = xlNone
        .Borders(xlInsideHorizontal).LineStyle = xlNone
        .Borders(xlEdgeLeft).LineStyle = xlNone
        .Borders(xlEdgeRight).LineStyle = xlNone
        .Borders(xlEdgeTop).LineStyle = xlNone
        .Borders(xlEdgeBottom).LineStyle = xlNone
    End With
End Sub

Sub graue_Rahmen_setzen(z As Range)
    ' -----------------------------------------------------------------------------------------
    ' ----- Makro von Uwe Haleksy, Dezember 2021 ----------------------------------------------
    ' ----- Hilfsmakro
    ' -----------------------------------------------------------------------------------------
    ' --- Info --------------------------------------------------------------------------------
    ' Dieses Makro erzeugt graue Zellrahmen im beschriebenen Bereich des Blattes "ARGOS Data".
    ' -----------------------------------------------------------------------------------------
    With z
        With z.Borders(xlEdgeLeft)
            .LineStyle = xlContinuous
            .Weight = xlThin
            .Color = RGB(175, 175, 175)
        End With
        With z.Borders(xlEdgeTop)
            .LineStyle = xlContinuous
            .Weight = xlThin
            .Color = RGB(175, 175, 175)
        End With
        With z.Borders(xlEdgeBottom)
            .LineStyle = xlContinuous
            .Weight = xlThin
            .Color = RGB(175, 175, 175)
        End With
        With z.Borders(xlEdgeRight)
            .LineStyle = xlContinuous
            .Weight = xlThin
            .Color = RGB(175, 175, 175)
        End With
        On Error GoTo NixSenkrecht
        With z.Borders(xlInsideVertical)
            .LineStyle = xlContinuous
            .Weight = xlThin
            .Color = RGB(175, 175, 175)
        End With
NixSenkrecht:
        Resume WeiterOhneSenkrecht
WeiterOhneSenkrecht:
        On Error GoTo 0

        On Error GoTo NixWaagrecht
        With z.Borders(xlInsideHorizontal)
            .LineStyle = xlContinuous
            .Weight = xlThin
            .Color = RGB(175, 175, 175)
        End With
NixWaagrecht:
        Resume WeiterOhneWaagrecht
WeiterOhneWaagrecht:
        On Error GoTo 0
    End With
End Sub

Sub NeueZeile_in_Krieg()
    
    If Not ThisWorkbook.Names("helper_countryCount_war_filled").RefersToRange.value Then
        MsgBox "Please fill in all empty fields first."
        Exit Sub
    End If
    Call additionalRowsRequest(war)
    
End Sub

Sub NeueZeile_in_Streik()
    
    If Not ThisWorkbook.Names("helper_countryCount_strikeAndRiot_filled").RefersToRange.value Then
        MsgBox "Please fill in all empty fields first."
        Exit Sub
    End If
    Call additionalRowsRequest(strikeAndRiot)
    
End Sub

Sub NeueZeilen_in_GeoScope()
    
    Call additionalRowsRequest(geographicalScope)
    
End Sub

Sub additionalRowsRequest(coverage As additionalLinesRequiredEnum)
    
    Dim MAXINT As Integer
    MAXINT = 2 ^ 15 - 1
    
    Dim title As String
    Dim prompt As String
    If coverage = geographicalScope Then
        title = "Add Geographical Scope"
        prompt = "How many geographical Scopes do you want to add?"
    ElseIf coverage = strikeAndRiot Or coverage = war Then
        title = "Add additional countries"
        prompt = "How many additional countries do you want to add?"
    Else
        MsgBox prompt:="An error occurred. Please try again. If you keep encountering " & _
            "this error please refer to a developer with the following errorcode: aRRcI."
        Exit Sub
    End If
    
    Dim inputValue As Variant
    Dim additionalRows As Integer
    inputValue = Application.InputBox(prompt:=prompt, title:=title, Default:="1", Type:=1)
    If inputValue = False Then
        MsgBox "Process canceled."
        Exit Sub
    End If
    Dim dblTmp As Double
    dblTmp = CDbl(inputValue)
    If dblTmp > MAXINT Or dblTmp < -MAXINT Then
        MsgBox "Value to extreme."
        Exit Sub
    End If
    additionalRows = CInt(inputValue)
    If additionalRows <> dblTmp Then
        MsgBox "Value not a whole number."
        Exit Sub
    End If
    If additionalRows <= 0 Then
        MsgBox "Value not positive."
        Exit Sub
    End If
    If additionalRows > 10 Then
        MsgBox "To prevent erroneous entries, entries greater than 10 are reduced to 10." & vbLf & _
            "If you need more entries, please fill in the existing ones first and then add to them."
        additionalRows = 10
    End If
    
    If coverage = geographicalScope Then
        Call addRowsToGeoScope(additionalRows)
    Else
        Call addRowsToAdditionalCoverages(additionalRows, coverage)
    End If

End Sub

Sub addRowsToAdditionalCoverages(additionalRows As Integer, coverage As additionalLinesRequiredEnum)

    Dim targetRng As Range
    Dim countryCountPrev As Integer
    Dim nameSuffix As String
    
    If coverage = strikeAndRiot Then
        countryCountPrev = ThisWorkbook.Names("helper_countryCount_strikeAndRiot").RefersToRange.value
        nameSuffix = "_Streik"
    ElseIf coverage = war Then
        countryCountPrev = ThisWorkbook.Names("helper_countryCount_war").RefersToRange.value
        nameSuffix = "_Krieg"
    Else
        MsgBox prompt:="An error occurred. Please try again. If you keep encountering " & _
            "this error please refer to a developer with the following errorcode: aRTACcI."
        Exit Sub
    End If
    
    Set targetRng = _
            ThisWorkbook.Names("\selected_country" & countryCountPrev & nameSuffix).RefersToRange
    Range(targetRng.Offset(1, 0), targetRng.Offset(additionalRows, 0)).EntireRow.Insert Shift:=xlDown
    targetRng.EntireRow.Copy
    Range(targetRng.Offset(1, 0), targetRng.Offset(additionalRows, 0)).EntireRow.PasteSpecial Paste:=xlPasteFormats
    
    Dim i As Integer
    For i = 1 To additionalRows
        On Error Resume Next
        ThisWorkbook.Names("\selected_country" & countryCountPrev + i).Delete
        On Error GoTo 0
        ThisWorkbook.Names.Add Name:=("\selected_country" & countryCountPrev + i & nameSuffix), _
            RefersTo:=targetRng.Offset(i, 0)
    Next i
    
    Dim borderType As Variant
    With Range(targetRng, targetRng.Offset(additionalRows, 0))
        With .Borders(xlInsideHorizontal)
            .LineStyle = xlNone
            .Weight = xlThin
            .Color = RGB(175, 175, 175)
        End With
        For Each borderType In Array(xlEdgeBottom, xlEdgeLeft, xlEdgeRight)
            With .Borders(borderType)
                .LineStyle = xlContinuous
                .Weight = xlMedium
                .Color = RGB(0, 0, 0)
            End With
        Next borderType
    End With
    
    With Range(targetRng.Offset(0, 2), targetRng.Offset(additionalRows, 5))
        .Borders(xlInsideHorizontal).LineStyle = xlNone
        For Each borderType In Array(xlEdgeBottom, xlEdgeLeft, xlEdgeRight)
            With .Borders(borderType)
                .LineStyle = xlContinuous
                .Weight = xlMedium
                .Color = RGB(0, 0, 0)
            End With
        Next borderType
    End With

End Sub

Sub addRowsToGeoScope(additionalGeographicalScopes As Integer)
    
    Dim lastcurrentRow As Range
    Dim countryCountPrev As Integer
    countryCountPrev = ThisWorkbook.Names("helper_geoScopeCount").RefersToRange.value
    Set lastcurrentRow = ThisWorkbook.Names("Geoscope_int_Wegerisiko_" & countryCountPrev).RefersToRange.EntireRow
    
    Dim geoEnd As Range
    Set geoEnd = ThisWorkbook.Names("GeoEnde").RefersToRange
    
    Dim insertRng As Range
    Set insertRng = Range(geoEnd, geoEnd.Offset(additionalGeographicalScopes - 1, 0)).EntireRow
    insertRng.Insert Shift:=xlDown
    
    lastcurrentRow.Copy
    Range(lastcurrentRow.Offset(1, 0), geoEnd.Offset(-1, 0).EntireRow).PasteSpecial _
        Paste:=xlPasteAll, Operation:=xlNone, SkipBlanks:=False, Transpose:=False
    Application.CutCopyMode = False
    
    Dim i As Integer
    For i = 1 To additionalGeographicalScopes
        On Error Resume Next
        ThisWorkbook.Names("Geoscope_int_Wegerisiko_" & countryCountPrev + i).Delete
        ThisWorkbook.Names("Geoscope_int_from_" & countryCountPrev + i).Delete
        ThisWorkbook.Names("Geoscope_int_to_" & countryCountPrev + i).Delete
        ThisWorkbook.Names("Geoscope_int_Split_" & countryCountPrev + i).Delete
        ThisWorkbook.Names("Geoscope_int_LoadDisc_" & countryCountPrev + i).Delete
        On Error GoTo 0
        
        ThisWorkbook.Names.Add Name:=("Geoscope_int_Wegerisiko_" & countryCountPrev + i), _
            RefersTo:=ThisWorkbook.Names("Geoscope_int_Wegerisiko_" & countryCountPrev + i - 1).RefersToRange.Offset(1, 0)
        ThisWorkbook.Names.Add Name:=("Geoscope_int_from_" & countryCountPrev + i), _
            RefersTo:=ThisWorkbook.Names("Geoscope_int_from_" & countryCountPrev + i - 1).RefersToRange.Offset(1, 0)
        ThisWorkbook.Names.Add Name:=("Geoscope_int_to_" & countryCountPrev + i), _
            RefersTo:=ThisWorkbook.Names("Geoscope_int_to_" & countryCountPrev + i - 1).RefersToRange.Offset(1, 0)
        ThisWorkbook.Names.Add Name:=("Geoscope_int_Split_" & countryCountPrev + i), _
            RefersTo:=ThisWorkbook.Names("Geoscope_int_Split_" & countryCountPrev + i - 1).RefersToRange.Offset(1, 0)
        ThisWorkbook.Names.Add Name:=("Geoscope_int_LoadDisc_" & countryCountPrev + i), _
            RefersTo:=ThisWorkbook.Names("Geoscope_int_LoadDisc_" & countryCountPrev + i - 1).RefersToRange.Offset(1, 0)
    Next i
    
    ThisWorkbook.Names("helper_geoScopeCount").RefersToRange.Calculate

End Sub

Sub addRowToTechnicalAdjustments()
    
    With ThisWorkbook.Names("helper_technicalAdjustmentStopper").RefersToRange
        If IsEmpty(.Offset(-1, 0)) Then
            Exit Sub
        End If
        
        .EntireRow.Insert
        .Offset(-2, 0).EntireRow.Copy
        .Offset(-1, 0).EntireRow.PasteSpecial (xlPasteFormats)
        Application.CutCopyMode = False
        .Offset(-2, 1).Select
    End With
    
End Sub
