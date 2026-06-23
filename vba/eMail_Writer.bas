Attribute VB_Name = "eMail_Writer"
Sub prepare_Feedback()
    
    Call writeMail("Feedback")
    
End Sub

Sub prepare_Help()
    
    Call writeMail("Help")
    
End Sub


Sub writeMail(mailType As String)
    
    Dim mailTo As String
    mailTo = "Wilsch, Marc-Phillip <Marc-Phillip.Wilsch@hdi.global>"
    Dim cmpString As String
    cmpString = "Germany"
    If Left(ThisWorkbook.Names("\selected_riskcountry").RefersToRange.value, Len(cmpString)) = cmpString Then
        mailTo = mailTo & "; Schülken, Lea Marie <LeaMarie.Schuelken@hdi.global>"
    End If
    
    Dim olApp As Object
    Dim olEmail As Object
    
    Set olApp = GetObject(, "Outlook.Application")
    Set olEmail = olApp.CreateItem(olMailItem)
    
    Dim mailContent As String
    mailContent = "Dear CaTa supervisors,<br><br>I am writing you regarding the Pricing Tool CaTa. " & _
        "What I wanted to tell you is, that <strong style='color:red'>ENTER YOUR MATTER HERE</strong>." & _
        "<br><br>Thank you very much for your time! Kind regards<br>" & Application.UserName
            
    With olEmail
        .Display
        .HTMLBody = mailContent & .HTMLBody
        .To = mailTo
        .CC = "Meffert, René <Rene.Meffert@hdi.global>"
        .Subject = "CaTa request - " & mailType
    End With

End Sub
