using Immuno;
using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Vitae.Core
{
    public class WorkitemsBacklogCorp : RESTCorpuscle
    {
        public WorkitemsBacklogCorp()
        {
            Text = "workitem";
        }

        public IEnchyma GET(IEnchyma req)
        {
            var queryString = req.TypeOf<IEnchyma>("querystring");
            
            string projectid = Immuno.Security.Base64Encoder.DecodeBase64(queryString.StringEx("proj"));
            string parentId = queryString.StringEx("parent");//Immuno.Security.Base64Encoder.DecodeBase64(queryString.StringEx("parent"));
            int size = queryString.Numberic("size", 100);
            int skipsize = queryString.Numberic("current", 0) * size;


            int status = queryString.Numberic("status", 0);
            var assigned = queryString.StringEx("assigned");
            var document = Immuno.Database.DocumentDB.DbContext.CreateDbContext("Vitae", "Workitems").Connect().Context.Client.CreateDocumentQuery<Immuno.Vitae.Model.WorkitemModel>($"/dbs/Vitae/colls/Workitems").Where(m => string.IsNullOrWhiteSpace(parentId)?m.Parent==null :m.Parent.Id==parentId);
            if (!string.IsNullOrEmpty(assigned))
            {
                if (assigned.Equals("me"))
                {
                    document = document.Where(m => m.Assign.Id == this.OrgRuntime.Who.Token);
                }
                else
                {
                    document = document.Where(m => m.Assign.Id == assigned);
                }
            }
            if (!string.IsNullOrEmpty(projectid))
            {
                document = document.Where(m => m.Project.Id == projectid);
            }
            if (status == -1)
            {
                document = document.Where(m => m.Status != "Completed");
            }
            else if (status == 1)
            {
                document = document.Where(m => m.Status == "New");
            }
            else if (status == 2)
            {
                document = document.Where(m => m.Status == "Processing");
            }

            var result = document
                            .OrderByDescending(m => m.Timestamp)
                            //.Skip(skipsize)
                            //.Take(size)
                            .AsEnumerable();

            if (result.Count() > 0)
            {
                return Response(result);
            }
            return Response(null, 300);
        }

        public IEnchyma POST(IEnchyma req)
        {
            var queryString = req.TypeOf<IEnchyma>("forms");

            //if (this.OrgRuntime.Who == null)
            //{
            //    return ResponseFailed("游客身份不能进行评论，请登录后评论");
            //}
            string u = "8465BAFE-DFFB-45D2-9685-514182AEEDB6";
            IEnchyma dbresp = null;
            string projectid = queryString.StringEx("proj");

            var endingdate = queryString.StringEx("ending");
            var startingDate = queryString.StringEx("starting");
            if (!string.IsNullOrWhiteSpace(endingdate))
            {
                endingdate = $"'{endingdate}'";
            }
            else
            {
                endingdate = "null";
            }
            if (!string.IsNullOrWhiteSpace(startingDate))
            {
                startingDate = $"'{startingDate}'";
            }
            else
            {
                startingDate = "null";
            }
            string guid = Guid.NewGuid().ToString();

            if (string.IsNullOrWhiteSpace(projectid))
            {
                dbresp = Immuno.Database.Unsophisticated.Unsophisticated.NonQuery($"insert into Workitems(Workitem,Title,Priority,Status,Classify,Assigned,EvaluationTime,Description,Iterations,ParentWorkitem,Created,StartingWork,EndingWork,Creator) values('{guid}','{queryString.String("Title").Replace("'", "''")}',{queryString.Numberic("Priority")},'{queryString.String("Status")}','{queryString.String("type")}','{u}',{queryString.Numberic("evaluation")},N'{queryString.String("Description").Replace("'", "''")}',N'{queryString.String("Iteration")}','{Immuno.Security.Base64Encoder.DecodeBase64(queryString.StringEx("parentWorkitem"))}',getdate(),{startingDate},{endingdate},'{u}')");
            }
            else
            {
                dbresp = Immuno.Database.Unsophisticated.Unsophisticated.NonQuery(
                    $"insert into Workitems(workitem,ProjectId,Title,Priority,Status,Classify,Assigned,EvaluationTime,Description,Iterations,ParentWorkitem,Created,StartingWork,EndingWork,creator) values('{guid}','{projectid}','{queryString.String("Title").Replace("'", "''")}',{queryString.Numberic("Priority")},'{queryString.String("Status")}','{queryString.String("type")}','{u}',{queryString.Numberic("evaluation")},N'{queryString.String("Description").Replace("'", "''")}',N'{queryString.String("Iteration")}','{Immuno.Security.Base64Encoder.DecodeBase64(queryString.StringEx("parentWorkitem"))}',getdate(),{startingDate},{endingdate},'{u}')");
            }
            if (dbresp.Result)
            {
                return Response(new { result = true });
            }
            else
            {
                return Response(dbresp.String("exception"), 501);
            }
        }

        public IEnchyma HEAD(IEnchyma req)
        {

            var queryString = req.TypeOf<IEnchyma>("querystring");

            //if (this.OrgRuntime.Who == null)
            //{
            //    return ResponseFailed("游客身份不能进行评论，请登录后评论");
            //}

            string onFile = queryString.String("file");
            var dbresp = Immuno.Database.Unsophisticated.Unsophisticated.Query($"select * from file_comment where OnFile='{onFile}'");
            if (dbresp.Result)
            {
                return Response(dbresp, 200);
            }
            return ResponseFailed("加载内容失败，请刷新页面。");
        }

        public IEnchyma PUT(IEnchyma req)
        {
            var forms = req.TypeOf<IEnchyma>("forms");

            //if (this.OrgRuntime.Who == null)
            //{
            //    return ResponseFailed("游客身份不能进行评论，请登录后评论");
            //}
            string workid = Immuno.Security.Base64Encoder.DecodeBase64(forms.String("workitem"));
            if (string.IsNullOrWhiteSpace(workid))
            {
                return Response(null, 501);
            }
            var assigned = Immuno.Security.Base64Encoder.DecodeBase64(forms.String("assigned"));
            if (string.IsNullOrWhiteSpace(assigned))
            {
                assigned = this.OrgRuntime.Who.Token;
            }
            var status = forms.StringEx("status");
            var enddate = "null";
            var endingdate = "null";
            var startingDate = "null";
            if (forms.Contains("ending"))
            {
                endingdate = $"'{forms.StringEx("ending")}'";
            }
            if (forms.Contains("starting"))
            {
                startingDate = $"'{forms.StringEx("starting")}'";
            }
            if (status.Equals("Completed"))
            {
                enddate = "getdate()";
            }

            var projectId = Immuno.Security.Base64Encoder.DecodeBase64(forms.StringEx("project"));

            projectId = !string.IsNullOrWhiteSpace(projectId) ? "'" + projectId + "'" : "null";

            var dbresp = Immuno.Database.Unsophisticated.Unsophisticated.NonQuery(
                $"update workitems set projectId={projectId},title=N'{forms.StringEx("title").Replace("'", "''")}',priority={forms.Numberic("priority", 0)},status='{status}',classify='{forms.StringEx("type")}',Assigned='{assigned}',evaluationtime='{forms.StringEx("evaluation")}',description='{forms.StringEx("description").Replace("'", "''")}',enddate={enddate},iterations='{Immuno.Security.Base64Encoder.DecodeBase64(forms.StringEx("iteration"))}',endingwork={endingdate},startingwork={startingDate} where workitem='{workid}'");

            if (dbresp.Result)
            {
                return Response(true, 200);
            }
            return ResponseFailed("加载内容失败，请刷新页面。");
        }

        public IEnchyma DELETE(IEnchyma req)
        {
            var forms = req.TypeOf<IEnchyma>("forms");

            //if (this.OrgRuntime.Who == null)
            //{
            //    return ResponseFailed("游客身份不能进行评论，请登录后评论");
            //}

            string workid = Immuno.Security.Base64Encoder.DecodeBase64(forms.String("workitem"));

            var dbresp = Immuno.Database.Unsophisticated.Unsophisticated.NonQuery(
                $"Delete from workitems where workitem='{workid}'");

            if (dbresp.Result)
            {
                return Response(true, 200);
            }
            return ResponseFailed("加载内容失败，请刷新页面。");
        }
    }
}
