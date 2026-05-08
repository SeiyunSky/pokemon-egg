FROM nginx:1.27-alpine

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/app.conf

# 拷贝前端静态文件（pokemon-egg-game 根目录内容）
COPY ../index.html    /usr/share/nginx/html/
COPY ../style.css     /usr/share/nginx/html/
COPY ../src           /usr/share/nginx/html/src
COPY ../assets        /usr/share/nginx/html/assets

EXPOSE 80
