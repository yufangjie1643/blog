using System;
using System.Diagnostics;
using System.IO;
using System.ServiceProcess;
using System.Threading;

public sealed class OwnerBlogService : ServiceBase
{
    private const string ServiceNameValue = "OwnerBlog5100";
    private const int MonitorIntervalMs = 5000;

    private readonly object syncRoot = new object();
    private Process childProcess;
    private Timer monitorTimer;
    private string projectRoot;
    private string logDirectory;
    private string npmCommand;
    private bool stopping;

    public OwnerBlogService()
    {
        ServiceName = ServiceNameValue;
        CanStop = true;
        CanShutdown = true;
        AutoLog = true;
    }

    protected override void OnStart(string[] args)
    {
        projectRoot = AppDomain.CurrentDomain.BaseDirectory.TrimEnd(Path.DirectorySeparatorChar);
        logDirectory = Path.Combine(projectRoot, "logs");
        Directory.CreateDirectory(logDirectory);
        npmCommand = ResolveNpmCommand();

        WriteServiceLog("Service starting. Project root: " + projectRoot);

        lock (syncRoot)
        {
            stopping = false;
            StartChildProcess();
            monitorTimer = new Timer(MonitorChildProcess, null, MonitorIntervalMs, MonitorIntervalMs);
        }
    }

    protected override void OnStop()
    {
        WriteServiceLog("Service stopping.");
        lock (syncRoot)
        {
            stopping = true;
            if (monitorTimer != null)
            {
                monitorTimer.Dispose();
                monitorTimer = null;
            }

            StopChildProcess();
        }
    }

    protected override void OnShutdown()
    {
        OnStop();
    }

    private void MonitorChildProcess(object state)
    {
        lock (syncRoot)
        {
            if (stopping)
            {
                return;
            }

            if (childProcess == null || childProcess.HasExited)
            {
                WriteServiceLog("Child process is not running. Restarting npm run dev.");
                StartChildProcess();
            }
        }
    }

    private void StartChildProcess()
    {
        if (childProcess != null)
        {
            childProcess.Dispose();
            childProcess = null;
        }

        string nodePath = Path.GetDirectoryName(npmCommand);
        string currentPath = Environment.GetEnvironmentVariable("PATH") ?? string.Empty;

        ProcessStartInfo startInfo = new ProcessStartInfo();
        startInfo.FileName = Path.Combine(Environment.SystemDirectory, "cmd.exe");
        startInfo.Arguments = "/d /s /c \"\"" + npmCommand + "\" run dev\"";
        startInfo.WorkingDirectory = projectRoot;
        startInfo.UseShellExecute = false;
        startInfo.CreateNoWindow = true;
        startInfo.RedirectStandardOutput = true;
        startInfo.RedirectStandardError = true;
        startInfo.EnvironmentVariables["ASTRO_TELEMETRY_DISABLED"] = "1";
        startInfo.EnvironmentVariables["PATH"] = nodePath + ";" + currentPath;

        childProcess = new Process();
        childProcess.StartInfo = startInfo;
        childProcess.EnableRaisingEvents = true;
        childProcess.OutputDataReceived += delegate(object sender, DataReceivedEventArgs e)
        {
            if (e.Data != null)
            {
                AppendLine("owner-blog-service.out.log", e.Data);
            }
        };
        childProcess.ErrorDataReceived += delegate(object sender, DataReceivedEventArgs e)
        {
            if (e.Data != null)
            {
                AppendLine("owner-blog-service.err.log", e.Data);
            }
        };

        childProcess.Start();
        childProcess.BeginOutputReadLine();
        childProcess.BeginErrorReadLine();
        WriteServiceLog("Started child process PID " + childProcess.Id + ".");
    }

    private void StopChildProcess()
    {
        if (childProcess == null)
        {
            return;
        }

        try
        {
            if (!childProcess.HasExited)
            {
                int childPid = childProcess.Id;
                WriteServiceLog("Stopping child process tree PID " + childPid + ".");
                RunTaskKill(childPid);
                childProcess.WaitForExit(10000);
            }
        }
        catch (Exception ex)
        {
            WriteServiceLog("Failed while stopping child process: " + ex);
        }
        finally
        {
            childProcess.Dispose();
            childProcess = null;
        }
    }

    private static void RunTaskKill(int processId)
    {
        ProcessStartInfo startInfo = new ProcessStartInfo();
        startInfo.FileName = Path.Combine(Environment.SystemDirectory, "taskkill.exe");
        startInfo.Arguments = "/PID " + processId + " /T /F";
        startInfo.UseShellExecute = false;
        startInfo.CreateNoWindow = true;

        using (Process process = Process.Start(startInfo))
        {
            process.WaitForExit(10000);
        }
    }

    private static string ResolveNpmCommand()
    {
        string programFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
        string npmInProgramFiles = Path.Combine(programFiles, "nodejs", "npm.cmd");
        if (File.Exists(npmInProgramFiles))
        {
            return npmInProgramFiles;
        }

        string programFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
        string npmInProgramFilesX86 = Path.Combine(programFilesX86, "nodejs", "npm.cmd");
        if (File.Exists(npmInProgramFilesX86))
        {
            return npmInProgramFilesX86;
        }

        return "npm.cmd";
    }

    private void WriteServiceLog(string message)
    {
        AppendLine("owner-blog-service.log", message);
    }

    private void AppendLine(string fileName, string message)
    {
        string line = DateTimeOffset.Now.ToString("yyyy-MM-dd HH:mm:ss zzz") + " " + message + Environment.NewLine;
        string path = Path.Combine(logDirectory, fileName);

        lock (syncRoot)
        {
            File.AppendAllText(path, line);
        }
    }

    public static void Main()
    {
        ServiceBase.Run(new OwnerBlogService());
    }
}
