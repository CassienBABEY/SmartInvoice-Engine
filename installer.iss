; Script Inno Setup pour SmartInvoice Engine
; Installer Windows professionnel avec désinstalleur
; Compilation: iscc installer.iss

#define MyAppName "SmartInvoice Engine"
#define MyAppVersion "0.2.0"
#define MyAppPublisher "SmartInvoice"
#define MyAppURL "https://github.com/yourusername/smartinvoice-engine"
#define MyAppExeName "SmartInvoice.bat"
#define MyAppIcon "logo.png"

[Setup]
; Informations de l'application
AppId={{8F9A5E2B-3C4D-4E5F-6A7B-8C9D0E1F2A3B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; Dossier d'installation par défaut
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes

; Fichiers de sortie
OutputDir=installer_output
OutputBaseFilename=SmartInvoice-Setup-{#MyAppVersion}
SetupIconFile=logo.png

; Compression
Compression=lzma2/max
SolidCompression=yes

; Interface
WizardStyle=modern
WizardImageFile=compiler:WizModernImage-IS.bmp
WizardSmallImageFile=compiler:WizModernSmallImage-IS.bmp

; Permissions
PrivilegesRequired=admin
PrivilegesRequiredOverridesAllowed=dialog

; Architecture
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

; Désinstallation
UninstallDisplayIcon={app}\logo.png
UninstallDisplayName={#MyAppName}

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Exécutables et DLLs
Source: "dist\SmartInvoiceEngine\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

; Logo
Source: "logo.png"; DestDir: "{app}"; Flags: ignoreversion

; Templates par défaut
Source: "templates\*"; DestDir: "{app}\templates"; Flags: ignoreversion recursesubdirs createallsubdirs; Permissions: users-modify

; Assets
Source: "assets\*"; DestDir: "{app}\assets"; Flags: ignoreversion recursesubdirs createallsubdirs; Permissions: users-modify

[Dirs]
; Dossiers avec permissions d'écriture pour l'utilisateur
Name: "{app}\forms"; Permissions: users-modify
Name: "{app}\invoices"; Permissions: users-modify
Name: "{app}\invoices_pdf"; Permissions: users-modify
Name: "{app}\templates"; Permissions: users-modify
Name: "{app}\assets\images"; Permissions: users-modify

[Icons]
; Icône dans le menu démarrer
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\logo.png"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"

; Icône sur le bureau
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\logo.png"; Tasks: desktopicon

; Icône dans la barre de lancement rapide
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\logo.png"; Tasks: quicklaunchicon

[Run]
; Proposer de lancer l'application après installation
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: shellexec postinstall skipifsilent nowait

[UninstallDelete]
; Nettoyer les fichiers générés lors de la désinstallation
Type: filesandordirs; Name: "{app}\forms"
Type: filesandordirs; Name: "{app}\invoices"
Type: filesandordirs; Name: "{app}\invoices_pdf"
Type: filesandordirs; Name: "{app}\__pycache__"
Type: filesandordirs; Name: "{app}\*.pyc"

[Code]
// Code Pascal pour des fonctionnalités avancées

// Vérifier si l'application est en cours d'exécution
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  // Vérifier si le processus est en cours
  if CheckForMutexes('SmartInvoiceEngineMutex') then
  begin
    if MsgBox('SmartInvoice Engine est en cours d''exécution. Voulez-vous le fermer et continuer l''installation ?', 
              mbConfirmation, MB_YESNO) = IDYES then
    begin
      // Tenter de fermer l'application
      Exec('taskkill', '/F /IM SmartInvoiceEngine.exe', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
      Result := True;
    end
    else
      Result := False;
  end
  else
    Result := True;
end;

// Message de bienvenue personnalisé
procedure CurPageChanged(CurPageID: Integer);
begin
  if CurPageID = wpWelcome then
  begin
    WizardForm.WelcomeLabel2.Caption := 
      'Cet assistant va installer SmartInvoice Engine sur votre ordinateur.' + #13#10 + #13#10 +
      'SmartInvoice Engine vous permet de générer des factures professionnelles ' +
      'à partir de templates DOCX personnalisables.' + #13#10 + #13#10 +
      'Cliquez sur Suivant pour continuer.';
  end;
end;

// Afficher un message après installation réussie
procedure DeinitializeSetup();
var
  ResultCode: Integer;
begin
  if WizardSilent() = False then
  begin
    if MsgBox('Installation terminée avec succès !' + #13#10 + #13#10 + 
              'Voulez-vous consulter le guide de démarrage rapide ?', 
              mbInformation, MB_YESNO) = IDYES then
    begin
      // Ouvrir le README ou une page web
      ShellExec('open', ExpandConstant('{app}\README.md'), '', '', SW_SHOW, ewNoWait, ResultCode);
    end;
  end;
end;

