using Immuno;
using Microsoft.Azure.Documents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.GanDong
{
    public class OrdersCorp : RESTCorpuscle
    {
        public OrdersCorp()
        {
            Text = "orders";
        }

        public IEnchyma GET(IEnchyma req)
        {
            var queryString = req.TypeOf<IEnchyma>("querystring");

            int size = queryString.Numberic("size", 100);
            int skipsize = queryString.Numberic("current", 0) * size;


            var client = queryString.StringEx("client");
            var document = Immuno.Database.DocumentDB.DbContext.CreateDbContext("GanDong", "Orders").Connect().Context.Client.CreateDocumentQuery<Immuno.GanDong.OrdersModel>($"/dbs/GanDong/colls/Orders").Where(m => m.Client == client);
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
            try
            {
                var queryString = req.TypeOf<IEnchyma>("forms");
                var doc = new Document();
                Immuno.Database.DocumentDB.DbContext.CreateDbContext("GanDong", "Orders").Connect().Add(doc);
                return Response(null, 300);
            }
            catch (Exception ex)
            {
                return ResponseFailed(501, ex.Message);
            }
        }
    

    //public IEnchyma HEAD(IEnchyma req)
    //{

    //    var queryString = req.TypeOf<IEnchyma>("querystring");

    //    //if (this.OrgRuntime.Who == null)
    //    //{
    //    //    return ResponseFailed("游客身份不能进行评论，请登录后评论");
    //    //}

    //    string onFile = queryString.String("file");
    //    var dbresp = Immuno.Database.Unsophisticated.Unsophisticated.Query($"select * from file_comment where OnFile='{onFile}'");
    //    if (dbresp.Result)
    //    {
    //        return Response(dbresp, 200);
    //    }
    //    return ResponseFailed("加载内容失败，请刷新页面。");
    //}

    //public IEnchyma PUT(IEnchyma req)
    //{
    //    var forms = req.TypeOf<IEnchyma>("forms");

    //    //if (this.OrgRuntime.Who == null)
    //    //{
    //    //    return ResponseFailed("游客身份不能进行评论，请登录后评论");
    //    //}
    //    string workid = Immuno.Security.Base64Encoder.DecodeBase64(forms.String("workitem"));
    //    if (string.IsNullOrWhiteSpace(workid))
    //    {
    //        return Response(null, 501);
    //    }
    //    var assigned = Immuno.Security.Base64Encoder.DecodeBase64(forms.String("assigned"));
    //    if (string.IsNullOrWhiteSpace(assigned))
    //    {
    //        assigned = this.OrgRuntime.Who.Token;
    //    }
    //    var status = forms.StringEx("status");
    //    var enddate = "null";
    //    var endingdate = "null";
    //    var startingDate = "null";
    //    if (forms.Contains("ending"))
    //    {
    //        endingdate = $"'{forms.StringEx("ending")}'";
    //    }
    //    if (forms.Contains("starting"))
    //    {
    //        startingDate = $"'{forms.StringEx("starting")}'";
    //    }
    //    if (status.Equals("Completed"))
    //    {
    //        enddate = "getdate()";
    //    }

    //    var projectId = Immuno.Security.Base64Encoder.DecodeBase64(forms.StringEx("project"));

    //    projectId = !string.IsNullOrWhiteSpace(projectId) ? "'" + projectId + "'" : "null";

    //    var dbresp = Immuno.Database.Unsophisticated.Unsophisticated.NonQuery(
    //        $"update workitems set projectId={projectId},title=N'{forms.StringEx("title").Replace("'", "''")}',priority={forms.Numberic("priority", 0)},status='{status}',classify='{forms.StringEx("type")}',Assigned='{assigned}',evaluationtime='{forms.StringEx("evaluation")}',description='{forms.StringEx("description").Replace("'", "''")}',enddate={enddate},iterations='{Immuno.Security.Base64Encoder.DecodeBase64(forms.StringEx("iteration"))}',endingwork={endingdate},startingwork={startingDate} where workitem='{workid}'");

    //    if (dbresp.Result)
    //    {
    //        return Response(true, 200);
    //    }
    //    return ResponseFailed("加载内容失败，请刷新页面。");
    //}

    public IEnchyma DELETE(IEnchyma req)
    {
        var forms = req.TypeOf<IEnchyma>("forms");

        if (this.OrgRuntime.Who == null)
        {
            return ResponseFailed("游客身份不能进行评论，请登录后评论");
        }
        try
        {
            string id = forms.String("id");
            var document = new Document();
            document.Id = id;
            Immuno.Database.DocumentDB.DbContext.CreateDbContext("GanDong", "Orders").Connect().Delete(document);

            return Response(null, 200);
        }
        catch (Exception ex)
        {
            return ResponseFailed(501, ex.Message);
        }
    }
}
}
