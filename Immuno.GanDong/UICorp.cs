namespace Immuno.GanDong
{
    using Immuno;
    using Immuno.Web;
    using System;
    using System.IO;

    public class HomeCorp : Immuno.Corpuscle
    {
        public HomeCorp() { Text = "home"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            try
            {
                Immuno.Web.ImmunoWebAuthoritarian.GetAuthenticateInfo(enchyma.TypeOf<Microsoft.AspNetCore.Http.HttpContext>("context"), "u");
            }
            catch (Exception ex)
            {

            }
            return this.View(new { result = true, data = 1 }, "index");
        }
    }


    public class ListCorp : Immuno.Corpuscle
    {
        public ListCorp() { Text = "list"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {

            return this.View(new { result = true, data = 1 }, "list");
        }
    }

    public class EditCorp : Immuno.Corpuscle
    {
        public EditCorp() { Text = "edit"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {

            IEnchyma req = enchyma.TypeOf<IEnchyma>("querystring");
            string p = req.String("p");

            //if (this.OrgRuntime.Who==null)
            //{
            //    return this.ResponseFailed(505, "forbids");
            //}
            var u = p;
            p = Immuno.Security.Base64Encoder.DecodeBase64(p);
            string username = "sekeys";// this.OrgRuntime.Who.Name;

            var folders = ImmunoServer.Server.Appsetting["rootDir"];
            var root = Path.Combine(folders, username);
            var folderResp = Immuno.Database.Unsophisticated.Unsophisticated.One($"select * from files where guid='{p}'");

            if (!folderResp.Result)
            {
                return this.View(new
                {
                    u = u,
                    name = "",
                    content = "",
                    info = ""
                }, "edit");
            }
            folders = Path.Combine(root, folderResp.String("path"), folderResp.String("filename"));
            var content = File.ReadAllText(folders);
            var filename = folderResp.String("filename");
            return this.View(new
            {
                u = u,
                name = filename,
                content = filename.EndsWith("html", StringComparison.OrdinalIgnoreCase) ? System.Text.Encodings.Web.HtmlEncoder.Default.Encode(content) : content,
                info = System.IO.File.ReadAllText(System.IO.Path.Combine(ImmunoServer.Server.Appsetting["rootDir"], "Description", folderResp.String("DescriptionDoc") + ".txt"))
            }, "edit");
        }
    }
    public class LoginCorp : Corpuscle
    {
        public LoginCorp() { Text = "login"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            return this.View(new { result = true, data = 1 }, "login");
        }
    }
    public class ReviewCorp : Corpuscle
    {
        public ReviewCorp() { Text = "review"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            return this.View(new { result = true, data = 1 }, "review");
        }
    }
    public class PublishCorpuscle : Corpuscle
    {
        public PublishCorpuscle() { Text = "publish"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {

            return this.View(new { result = true, data = 1 }, "publish");
        }

    }
    public class HistoryCorp : Corpuscle
    {
        public HistoryCorp() { Text = "history"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            return this.View(new { result = true, data = 1 }, "history");
        }
    }
    public class FolderCorp : Corpuscle
    {
        public FolderCorp() { Text = "folder"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            if (this.OrgRuntime.Who == null)
            {
                return this.View(new { message = "请登录后再进入此页面" }, "notallow");
            }
            return this.View(new { result = true, data = 1 }, "folder");
        }
    }
    public class RoomsCorp : Corpuscle
    {
        public RoomsCorp() { Text = "rooms"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            //if (this.OrgRuntime.Who == null)
            //{
            //    return this.View(new { message="请登录后再进入此页面" }, "notallow");
            //}
            return this.View(new { result = true, data = 1 }, "rooms");
        }
    }

    public class ChatsCorp : Corpuscle
    {
        public ChatsCorp() { Text = "chats"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            //if (this.OrgRuntime.Who == null)
            //{
            //    return this.View(new { message="请登录后再进入此页面" }, "notallow");
            //}
            return this.View(new { result = true, data = 1 }, "chats");
        }
    }
    public class GroupsCorp : Corpuscle
    {
        public GroupsCorp() { Text = "groups"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            //if (this.OrgRuntime.Who == null)
            //{
            //    return this.View(new { message="请登录后再进入此页面" }, "notallow");
            //}
            return this.View(new { result = true, data = 1 }, "groups");
        }
    }

    public class WorkitemsCorp : Corpuscle
    {
        public WorkitemsCorp() { Text = "workitems"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            //if (this.OrgRuntime.Who == null)
            //{
            //    return this.View(new { message="请登录后再进入此页面" }, "notallow");
            //}
            return this.View(new { result = true, data = 1 }, "workitems");
        }
    }
    public class BlogsCorp : Corpuscle
    {
        public BlogsCorp() { Text = "blogs"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            //if (this.OrgRuntime.Who == null)
            //{
            //    return this.View(new { message="请登录后再进入此页面" }, "notallow");
            //}
            return this.View(new { result = true, data = 1 }, "blogs");
        }
    }
    public class CaledarCorp : Corpuscle
    {
        public CaledarCorp() { Text = "caledar"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            //if (this.OrgRuntime.Who == null)
            //{
            //    return this.View(new { message="请登录后再进入此页面" }, "notallow");
            //}
            return this.View(new { result = true, data = 1 }, "Caledar");
        }
    }
    public class PrecautionsCorp : Corpuscle
    {
        public PrecautionsCorp() { Text = "precautions"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            //if (this.OrgRuntime.Who == null)
            //{
            //    return this.View(new { message="请登录后再进入此页面" }, "notallow");
            //}
            return this.View(new { result = true, data = 1 }, "precautions");
        }
    }
    public class MessagesCorp : Corpuscle
    {
        public MessagesCorp() { Text = "messages"; }
        protected override IEnchyma ServingCore(IEnchyma enchyma)
        {
            //if (this.OrgRuntime.Who == null)
            //{
            //    return this.View(new { message="请登录后再进入此页面" }, "notallow");
            //}
            return this.View(new { result = true, data = 1 }, "messages");
        }
    }
}
